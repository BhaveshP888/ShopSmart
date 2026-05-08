"use client";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import LoadingState from "@/components/LoadingState";
import ProductCard from "@/components/ProductCard";
import { processSearchQuery } from "@/app/actions";
import { Product } from "@/lib/api";

export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setProducts([]);
    setError(null);
    
    // Call the backend orchestration action
    const result = await processSearchQuery(query);

    if (!result.success) {
      setError(result.message || "SYSTEM_ERROR: Operation Failed.");
      setIsSearching(false);
      return;
    }

    setProducts(result.data.products);
    setIsSearching(false);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="mb-24 mt-8">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">
          Anti_Retail
        </h1>
        <p className="font-mono text-gray-500">Natural Language Commodity Locator // v1.0.0</p>
      </header>

      <section className="mb-16">
        <SearchBar onSearch={handleSearch} />
        {error && (
          <div className="mt-4 p-4 border-2 border-[#FF4500] bg-white text-[#FF4500] font-mono text-sm uppercase">
            {error}
          </div>
        )}
      </section>

      <section className="flex-grow">
        {isSearching && <LoadingState />}
        
        {!isSearching && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.currentPrice}
                store={product.store}
                imageUrl={product.imageUrl}
                hasPriceHistory={product.hasPriceHistory}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
