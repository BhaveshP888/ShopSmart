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
    <div 
      className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#F4F4F0] border-[3px] border-[#0A0A0A] w-full max-w-2xl relative flex flex-col max-h-[85vh] overflow-hidden"
        style={{ boxShadow: '12px 12px 0px 0px #0047FF' }}
      >
        
        {/* Modal Header — black strip */}
        <div className="flex justify-between items-center border-b-[3px] border-[#0A0A0A] bg-[#0A0A0A] text-[#F4F4F0] px-5 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#0047FF]" />
            <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">Cross_Store_Compare</h2>
          </div>
          <button 
            onClick={onClose}
            className="font-mono text-xs tracking-widest hover:text-[#0047FF] transition-colors uppercase font-bold"
          >
            [Close]
          </button>
        </div>

        {/* Origin strip */}
        <div className="px-5 py-3 border-b-[3px] border-[#0A0A0A]/10 shrink-0 flex justify-between items-center">
          <p className="font-mono text-[10px] text-[#6B6B6B] truncate tracking-wider uppercase max-w-[70%]">
            Origin: {productTitle}
          </p>
          <span className="font-mono text-xs font-bold text-[#0A0A0A]">{productPrice}</span>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="font-mono text-[#0047FF] text-sm font-bold tracking-[0.2em] mb-4">
                Scanning_Competitors<span className="cursor-blink" />
              </div>
              <div className="w-32 h-[3px] bg-[#A8A8A0]/20">
                <div className="h-full bg-[#0047FF] animate-pulse w-1/2" />
              </div>
            </div>
          ) : deals.length > 0 ? (
            <div className="flex flex-col gap-3">
              {deals.map((deal) => (
                <a 
                  key={deal.id} 
                  href={deal.link || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border-[3px] border-[#0A0A0A] p-4 bg-white flex justify-between items-start group hover:border-[#0047FF] transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex-grow min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 bg-[#0A0A0A] text-white tracking-[0.2em] uppercase shrink-0">
                        {deal.store}
                      </span>
                      <span className="font-mono text-[9px] text-[#A8A8A0] tracking-widest uppercase">
                        {deal.matchConfidence} match
                      </span>
                    </div>
                    <div className="font-bold text-xs sm:text-sm line-clamp-2 uppercase tracking-tight leading-snug">{deal.title}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-xl sm:text-2xl font-extrabold text-[#0047FF] tracking-tighter">{deal.price}</div>
                    <span className="font-mono text-[9px] text-[#6B6B6B] tracking-widest uppercase group-hover:text-[#0047FF] transition-colors">
                      View →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="font-mono text-[#A8A8A0] text-xs tracking-[0.3em] uppercase mb-3">
                No Matches Located
              </div>
              <div className="w-12 h-[3px] bg-[#A8A8A0]/30" />
            </div>
          )}
        </div>

        {/* Footer */}
        <button 
          onClick={onClose}
          className="shrink-0 w-full bg-[#0A0A0A] text-[#F4F4F0] py-4 font-mono font-bold text-sm uppercase tracking-[0.2em] hover:bg-[#0047FF] hover:text-white transition-colors duration-200 border-t-[3px] border-[#0A0A0A]"
        >
          [ Close_Compare ]
        </button>
      </div>
    </div>
  );
}
