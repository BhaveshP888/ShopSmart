"use client";
import { useState, useEffect } from "react";

const steps = [
  "TRANSLATING_INTENT...",
  "EXTRACTING_PARAMETERS...",
  "SCANNING_AMAZON_DB...",
  "SCANNING_FLIPKART_DB...",
  "AGGREGATING_RESULTS..."
];

export default function LoadingState() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((current) => (current + 1) % steps.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-24 flex flex-col items-center justify-center border-4 border-dashed border-gray-300">
      <div className="font-mono text-[#FF4500] text-xl md:text-3xl font-bold">
        {steps[stepIndex]}
      </div>
      <div className="mt-8 flex gap-3">
        <div className="w-3 h-3 bg-black animate-ping"></div>
        <div className="w-3 h-3 bg-black animate-ping" style={{ animationDelay: "200ms" }}></div>
        <div className="w-3 h-3 bg-black animate-ping" style={{ animationDelay: "400ms" }}></div>
      </div>
    </div>
  );
}
