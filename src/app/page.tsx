"use client";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import LoadingState from "@/components/LoadingState";
import ProductCard from "@/components/ProductCard";
import PriceHistoryModal from "@/components/PriceHistoryModal";
import CompareDealsModal from "@/components/CompareDealsModal";
import { processSearchQuery } from "@/app/actions";
import { Product } from "@/lib/api";

export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [resultCount, setResultCount] = useState(0);

  // Modal state — lifted to page level so modals render OUTSIDE the grid
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);
  const [compareProduct, setCompareProduct] = useState<Product | null>(null);

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
    <>
      <main className="min-h-screen flex flex-col pb-16">
        {/* Hero Header */}
        <header className="mb-12 sm:mb-20 mt-4 sm:mt-8">
          <div className="flex items-baseline gap-4 mb-3">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold uppercase tracking-[-0.06em] leading-[0.85]">
              Anti<span className="text-[#FF4500]">_</span>Retail
            </h1>
            <div className="hidden sm:block h-3 w-3 bg-[#FF4500] animate-pulse" />
          </div>
          <p className="font-mono text-[#6B6B6B] text-xs sm:text-sm tracking-[0.15em] uppercase">
            Natural Language Commodity Locator
          </p>
        </header>

        {/* Search Region */}
        <section className="mb-12 sm:mb-20">
          <SearchBar onSearch={handleSearch} />
          {error && (
            <div className="mt-6 p-4 border-[3px] border-[#FF4500] bg-[#F4F4F0] font-mono text-sm uppercase tracking-wider text-[#FF4500]">
              <span className="text-[#0A0A0A] mr-2">ERR:</span>{error}
            </div>
          )}
        </section>

        {/* Results Region */}
        <section className="flex-grow">
          {isSearching && <LoadingState />}
          
          {!isSearching && products.length > 0 && (
            <>
              {/* Results header strip */}
              <div className="flex justify-between items-center border-b-[3px] border-[#0A0A0A] pb-3 mb-8">
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#6B6B6B]">
                  {resultCount} Commodities Located
                </span>
                <span className="font-mono text-[10px] tracking-widest text-[#A8A8A0] uppercase">
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
                    onOpenHistory={() => setHistoryProduct(product)}
                    onOpenCompare={() => setCompareProduct(product)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Empty state */}
          {!isSearching && products.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-24 sm:py-40 text-center">
              <div className="font-mono text-[#A8A8A0] text-xs tracking-[0.3em] uppercase mb-6">
                // Awaiting_Query_Input
              </div>
              <div className="w-16 h-[3px] bg-[#A8A8A0]" />
            </div>
          )}
        </section>
      </main>

      {/* Modals rendered at root level — no transform ancestors */}
      <PriceHistoryModal 
        isOpen={!!historyProduct} 
        onClose={() => setHistoryProduct(null)} 
        productId={historyProduct?.id || ""}
        productTitle={historyProduct?.title || ""}
      />

      <CompareDealsModal 
        isOpen={!!compareProduct} 
        onClose={() => setCompareProduct(null)} 
        productTitle={compareProduct?.title || ""}
        productPrice={compareProduct?.currentPrice || ""}
      />
    </>
  );
}
