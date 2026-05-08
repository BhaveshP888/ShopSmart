"use server";

import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchAmazonProducts } from "@/lib/api";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken && redisUrl !== "your_upstash_redis_url_here" 
  ? new Redis({ url: redisUrl, token: redisToken }) 
  : null;

const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_google_gemini_api_key_here"
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function processSearchQuery(query: string) {
  // 1. Rate Limiting
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
    if (redis) {
      const key = `rate_limit:${ip}`;
      const currentCount = await redis.get<number>(key) || 0;
      if (currentCount >= 100) {
        return { success: false, message: "SYSTEM_LOCKOUT: You have exceeded the 100-query daily limit for testing." };
      }
      const pipeline = redis.pipeline();
      pipeline.incr(key);
      if (currentCount === 0) pipeline.expire(key, 86400);
      await pipeline.exec();
    }
  } catch (e) { console.error(e); }

  // 2. LLM Parsing
  let keywords = query;
  let maxPrice = null;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
      const prompt = `Extract shopping parameters from: "${query}". Return JSON: {"keywords":"string","max_price":number|null,"intent":"shopping"|"invalid"}`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanText = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
      const parsedData = JSON.parse(cleanText);

      if (parsedData.intent === "invalid") {
        return { success: false, message: "QUERY_REJECTED: Please search for a physical commodity." };
      }
      keywords = parsedData.keywords;
      maxPrice = parsedData.max_price;
    } catch (e: any) {
      console.error(e);
      return { success: false, message: `LLM_ERROR: ${e?.message || "Failed to parse query."}` };
    }
  } else {
    // Fallback if no API key is provided so you can still test UI locally
    console.log("No Gemini Key - Falling back to raw query");
  }

  // 3. API Orchestration (Step 5)
  // We run the searches concurrently
  const [amazonResults] = await Promise.all([
    fetchAmazonProducts(keywords, maxPrice)
  ]);

  return {
    success: true,
    data: {
      products: [...amazonResults]
    }
  };
}

export async function fetchCrossStoreDeals(title: string, originalPriceStr?: string) {
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey || apiKey === "your_serpapi_key_here") {
    console.log("Mocking cross-store deals for:", title);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Parse original price to generate realistic mocks (+/- 10%)
    const numericPrice = originalPriceStr ? parseFloat(originalPriceStr.replace(/[^0-9.]/g, '')) : 5000;
    
    return {
      success: true,
      data: [
        {
          id: "comp_1",
          store: "FLIPKART",
          title: `${title} - Standard Edition`,
          price: `₹${Math.floor(numericPrice * (0.92 + Math.random() * 0.15)).toLocaleString()}`,
          link: "#",
          matchConfidence: "98%"
        },
        {
          id: "comp_2",
          store: "CROMA",
          title: title,
          price: `₹${Math.floor(numericPrice * (0.88 + Math.random() * 0.10)).toLocaleString()}`,
          link: "#",
          matchConfidence: "100%"
        }
      ]
    };
  }

  // Use Gemini to extract the exact Brand + Model number for perfectly accurate cross-store matching
  let optimalQuery = title;
  try {
    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Extract the most precise Google Shopping search query (Brand + Model Number) from this product title: "${title}". Return ONLY the short search query string (e.g. "Samsung UA43UE81AFULXL" or "Apple iPhone 15 Pro Max"), nothing else. No markdown.`;
      const result = await model.generateContent(prompt);
      optimalQuery = result.response.text().trim();
    } else {
      optimalQuery = title.split('(')[0].split('-')[0].split('|')[0].trim();
    }
  } catch (e) {
    optimalQuery = title.split('(')[0].trim();
  }

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.append("engine", "google_shopping");
  url.searchParams.append("q", optimalQuery);
  url.searchParams.append("gl", "in"); // India region for INR
  url.searchParams.append("hl", "en");
  url.searchParams.append("api_key", apiKey);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error) {
      console.error("SerpApi returned an error:", data.error);
      return { success: false, message: data.error };
    }

    const results = data.inline_shopping_results || data.shopping_results || [];
    
    // Filter out Amazon (since we already have it) and map to our format
    const competitors = results
      .filter((item: any) => item.source && !item.source.toLowerCase().includes("amazon"))
      .slice(0, 4)
      .map((item: any, index: number) => ({
        id: `comp_${index}`,
        store: item.source.toUpperCase(),
        title: item.title,
        price: item.price || `₹${item.extracted_price}` || "N/A",
        link: item.link || item.product_link || "#",
        matchConfidence: index === 0 ? "99%" : "92%" 
      }));

    return { success: true, data: competitors };
  } catch (error) {
    console.error("SerpApi Error:", error);
    return { success: false, message: "Failed to fetch real comparisons." };
  }
}
