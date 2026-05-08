"use client";

import { useEffect, useState } from "react";
import { fetchCrossStoreDeals } from "@/app/actions";

interface CompareDealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productPrice: string;
}

export default function CompareDealsModal({ isOpen, onClose, productTitle, productPrice }: CompareDealsModalProps) {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    
    let isMounted = true;
    setLoading(true);
    setDeals([]);

    fetchCrossStoreDeals(productTitle, productPrice).then((res) => {
      if (!isMounted) return;
      if (res.success) {
        setDeals(res.data);
      } else {
        console.error("Failed to fetch deals:", res.message);
        setDeals([]);
      }
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [isOpen, productTitle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 max-w-[70%] ">
      <div className="bg-[#F4F4F0] border-4 border-black w-full max-w-2xl p-6 relative flex flex-col shadow-[16px_16px_0px_0px_#0055FF] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b-4 border-black pb-4">
          <div>
            <h2 className="font-black text-2xl uppercase tracking-tighter mb-1">Cross-Store Compare</h2>
            <p className="font-mono text-sm text-gray-600 truncate max-w-sm ">Origin: {productTitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-4xl font-black leading-none hover:text-[#0055FF] transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="w-full min-h-[250px] flex flex-col justify-center">
          {loading ? (
            <div className="font-mono animate-pulse text-lg font-bold tracking-widest text-[#0055FF] text-center py-10">
              // AI_AGENT_SEARCHING_OTHER_STORES...
            </div>
          ) : deals.length > 0 ? (
            <div className="flex flex-col gap-4">
              {deals.map((deal) => (
                <div key={deal.id} className="border-2 border-black p-4 bg-white flex justify-between items-center group hover:bg-black hover:text-white transition-colors cursor-pointer">
                  <div>
                    <div className="font-mono text-xs font-bold mb-1 px-10 py-0.5 bg-black text-white inline-block group-hover:bg-white group-hover:text-black">
                      {deal.store}
                    </div>
                    <div className="font-bold line-clamp-1">{deal.title}</div>
                    <div className="font-mono text-xs text-gray-500 mt-1 group-hover:text-gray-300">
                      Match Confidence: {deal.matchConfidence}
                    </div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <div className="font-mono text-2xl font-black text-[#0055FF]">{deal.price}</div>
                    <a href={deal.link} target="_blank" rel="noopener noreferrer" className="block text-xs uppercase font-bold mt-1 underline decoration-2 underline-offset-4 hover:text-black">
                      View Deal
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="font-mono text-center text-gray-500 py-10 uppercase tracking-widest border-2 border-dashed border-gray-400">
              [EXCLUSIVE_COMMODITY] NO_MATCHES_FOUND
            </div>
          )}
        </div>

        {/* Footer */}
        <button 
          onClick={onClose}
          className="mt-8 w-full bg-black text-white py-4 font-mono font-bold text-xl uppercase tracking-widest hover:bg-[#0055FF] hover:text-white transition-colors"
        >
          [ CLOSE_COMPARE ]
        </button>
      </div>
    </div>
  );
}
