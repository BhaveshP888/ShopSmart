"use client";
import { useState } from "react";
import PriceHistoryModal from "./PriceHistoryModal";
import CompareDealsModal from "./CompareDealsModal";

export default function ProductCard({
  id,
  title,
  price,
  store,
  imageUrl,
  hasPriceHistory,
}: any) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Generate a fake SKU to enforce the industrial aesthetic
  const sku = `SKU-${id.substring(0, 6).toUpperCase()}`;

  return (
    <>
      <div className="group relative border-[3px] border-black bg-white flex flex-col h-full hover:shadow-[12px_12px_0px_0px_rgba(255,69,0,1)] hover:-translate-y-2 transition-all duration-300">
        {/* Manifest Header */}
        <div className="flex justify-between items-center border-b-[3px] border-black bg-black text-white px-3 py-1.5 shrink-0">
          <span className="font-mono text-[10px] tracking-[0.2em]">{sku}</span>
          <span className="font-mono text-[10px] tracking-widest text-[#FF4500]">
            {store}
          </span>
        </div>

        {/* Image Region */}
        <div className="w-full aspect-square bg-white border-b-[3px] border-black relative overflow-hidden flex items-center justify-center p-6 shrink-0">
          {/* subtle technical grid background */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          ></div>

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-contain mix-blend-multiply relative z-10 group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-gray-300 bg-gray-50 text-xs">
              NO_DATA
            </div>
          )}
        </div>

        {/* Info Region */}
        <div className="flex-grow p-5 flex flex-col justify-between bg-[#F4F4F0]">
          <h3 className="font-sans font-bold text-sm leading-snug mb-6 line-clamp-3 uppercase tracking-tight">
            {title}
          </h3>
          <div>
            <div className="font-mono text-[10px] text-gray-500 mb-1 tracking-widest">
              MARKET_VAL
            </div>
            <div className="font-mono text-3xl lg:text-4xl font-black tracking-tighter">
              {price}
            </div>
          </div>
        </div>

        {/* Action Region */}
        <div className="grid grid-cols-2 border-t-[3px] border-black divide-x-[3px] divide-black mt-auto shrink-0 bg-white">
          {hasPriceHistory ? (
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="font-mono text-[11px] py-4 uppercase hover:bg-black hover:text-white transition-colors tracking-widest font-bold"
            >
              History
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-100 text-gray-400 font-mono text-[11px] py-4 uppercase cursor-not-allowed tracking-widest font-bold"
            >
              N/A
            </button>
          )}
          <button
            onClick={() => setIsCompareOpen(true)}
            className="bg-[#FF4500] text-black font-mono text-[11px] py-4 uppercase hover:bg-black hover:text-[#FF4500] transition-colors tracking-widest font-bold"
          >
            Compare
          </button>
        </div>
      </div>

      <PriceHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        productId={id}
        productTitle={title}
      />

      <CompareDealsModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        productTitle={title}
        productPrice={price}
      />
    </>
  );
}
