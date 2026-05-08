export interface Product {
  id: string;
  store: "AMAZON" | "FLIPKART" | "OTHER";
  title: string;
  imageUrl: string;
  currentPrice: string;
  currency: string;
  productUrl: string;
  hasPriceHistory: boolean;
}

export async function fetchAmazonProducts(keywords: string, maxPrice: number | null): Promise<Product[]> {
  const apiKey = process.env.RAINFOREST_API_KEY;
  
  // MVP Fallback: If no API key is provided, return simulated real data to test the UI flow
  if (!apiKey || apiKey === "your_rainforest_api_key_here") {
    console.log("Mocking Amazon search for:", keywords);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return [
      {
        id: "mock_amz_1",
        store: "AMAZON",
        title: `Premium ${keywords.split(" ")[0] || "Commodity"} - Heavy Duty Industrial Grade`,
        imageUrl: "",
        currentPrice: maxPrice ? `₹${(maxPrice * 0.9).toFixed(0)}` : "₹4599",
        currency: "INR",
        productUrl: "#",
        hasPriceHistory: true,
      },
      {
        id: "mock_amz_2",
        store: "AMAZON",
        title: `Generic ${keywords.toUpperCase()} Base Model (No Box)`,
        imageUrl: "",
        currentPrice: maxPrice ? `₹${(maxPrice * 0.5).toFixed(0)}` : "₹1899",
        currency: "INR",
        productUrl: "#",
        hasPriceHistory: false, // Hides history button
      }
    ];
  }

  // Real Rainforest API Implementation
  const url = new URL("https://api.rainforestapi.com/request");
  url.searchParams.append("api_key", apiKey);
  url.searchParams.append("type", "search");
  url.searchParams.append("amazon_domain", "amazon.in");
  url.searchParams.append("search_term", keywords);
  if (maxPrice) url.searchParams.append("max_price", maxPrice.toString());

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (!data.search_results) return [];

    return data.search_results.slice(0, 4).map((item: any) => ({
      id: item.asin,
      store: "AMAZON",
      title: item.title,
      imageUrl: item.image,
      currentPrice: item.price?.raw || "N/A",
      currency: item.price?.currency || "INR",
      productUrl: item.link,
      hasPriceHistory: true, 
    }));
  } catch (error) {
    console.error("Rainforest API Error:", error);
    return [];
  }
}
