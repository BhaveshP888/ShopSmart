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
  const [resultCount, setResultCount] = useState(0);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setProducts([]);
    setError(null);
    
    const result = await processSearchQuery(query);

    if (!result.success) {
      setError(result.message || "SYSTEM_ERROR: Operation Failed.");
      setIsSearching(false);
      return;
    }

    setProducts(result.data.products);
    setResultCount(result.data.products.length);
    setIsSearching(false);
  };

  return (
    <main className="min-h-screen flex flex-col pb-16">
      {/* Hero Header */}
      <header className="mb-12 sm:mb-20 mt-4 sm:mt-8">
        <div className="flex items-baseline gap-4 mb-3">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold uppercase tracking-[-0.06em] leading-[0.85]">
            Anti<span className="text-accent">_</span>Retail
          </h1>
          <div className="hidden sm:block h-3 w-3 bg-accent animate-pulse" />
        </div>
        <p className="font-mono text-ink-muted text-xs sm:text-sm tracking-[0.15em] uppercase">
          Natural Language Commodity Locator
        </p>
      </header>

      {/* Search Region */}
      <section className="mb-12 sm:mb-20">
        <SearchBar onSearch={handleSearch} />
        {error && (
          <div className="mt-6 p-4 border-[3px] border-accent bg-surface-elevated font-mono text-sm uppercase tracking-wider text-accent">
            <span className="text-ink mr-2">ERR:</span>{error}
          </div>
        )}
      </section>

      {/* Results Region */}
      <section className="flex-grow">
        {isSearching && <LoadingState />}
        
        {!isSearching && products.length > 0 && (
          <>
            {/* Results header strip */}
            <div className="flex justify-between items-center border-b-[3px] border-ink pb-3 mb-8">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-ink-muted">
                {resultCount} Commodities Located
              </span>
              <span className="font-mono text-[10px] tracking-widest text-ink-faint uppercase">
                Source: Amazon.in
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
          </>
        )}

        {/* Empty state */}
        {!isSearching && products.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 sm:py-40 text-center">
            <div className="font-mono text-ink-faint text-xs tracking-[0.3em] uppercase mb-6">
              // Awaiting_Query_Input
            </div>
            <div className="w-16 h-[3px] bg-ink-faint" />
          </div>
        )}
      </section>
    </main>
  );
}
