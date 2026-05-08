"use client";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  store: string;
  imageUrl: string;
  hasPriceHistory: boolean;
  onOpenHistory: () => void;
  onOpenCompare: () => void;
}

export default function ProductCard({ id, title, price, store, imageUrl, hasPriceHistory, onOpenHistory, onOpenCompare }: ProductCardProps) {
  const sku = `${id.substring(0, 8).toUpperCase()}`;

  return (
    <div className="group relative border-[3px] border-[#0A0A0A] bg-white flex flex-col h-full transition-all duration-300 hover:shadow-[8px_8px_0px_0px_#FF4500] hover:-translate-y-1.5">
      
      {/* Manifest Header */}
      <div className="flex justify-between items-center border-b-[3px] border-[#0A0A0A] bg-[#0A0A0A] text-[#F4F4F0] px-3 py-1.5 shrink-0">
        <span className="font-mono text-[9px] tracking-[0.25em] text-[#A8A8A0]">{sku}</span>
        <span className="font-mono text-[9px] tracking-[0.25em] text-[#FF4500] font-bold">{store}</span>
      </div>

      {/* Image Region */}
      <div className="w-full aspect-[4/3] bg-white border-b-[3px] border-[#0A0A0A] relative overflow-hidden flex items-center justify-center p-4 sm:p-6 shrink-0">
        <div className="absolute inset-0 texture-dots" aria-hidden="true" />
        
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-contain mix-blend-multiply relative z-10 group-hover:scale-105 transition-transform duration-500 ease-out" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-[#A8A8A0] text-[10px] tracking-widest uppercase">
            No_Image
          </div>
        )}
      </div>

      {/* Info Region */}
      <div className="flex-grow p-3 sm:p-4 flex flex-col justify-between bg-[#F4F4F0]">
        <h3 className="font-bold text-xs sm:text-sm leading-snug mb-4 line-clamp-2 uppercase tracking-tight">
          {title}
        </h3>
        <div>
          <div className="font-mono text-[9px] text-[#A8A8A0] mb-0.5 tracking-[0.3em] uppercase">Mkt_Val</div>
          <div className="font-mono text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tighter">{price}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 border-t-[3px] border-[#0A0A0A] divide-x-[3px] divide-[#0A0A0A] mt-auto shrink-0">
        {hasPriceHistory ? (
          <button 
            onClick={onOpenHistory}
            className="font-mono text-[10px] py-3 uppercase tracking-[0.15em] font-bold bg-[#F4F4F0] hover:bg-[#0A0A0A] hover:text-[#F4F4F0] transition-colors duration-200"
          >
            History
          </button>
        ) : (
          <button disabled className="bg-[#EAEAE6] text-[#A8A8A0] font-mono text-[10px] py-3 uppercase cursor-not-allowed tracking-[0.15em] font-bold">
            N/A
          </button>
        )}
        <button 
          onClick={onOpenCompare}
          className="bg-[#FF4500] text-[#0A0A0A] font-mono text-[10px] py-3 uppercase tracking-[0.15em] font-bold hover:bg-[#0A0A0A] hover:text-[#FF4500] transition-colors duration-200"
        >
          Compare
        </button>
      </div>
    </div>
  );
}
