"use client";
import { useState, useEffect } from "react";

const steps = [
  "PARSING_NATURAL_LANGUAGE",
  "EXTRACTING_INTENT_PARAMS",
  "QUERYING_AMAZON_IN",
  "INDEXING_PRICE_DATA",
  "COMPILING_MANIFEST",
];

export default function LoadingState() {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((current) => (current + 1) % steps.length);
    }, 900);

    const progressInterval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 2));
    }, 50);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="w-full py-16 sm:py-24 flex flex-col items-center justify-center border-[3px] border-dashed border-ink-faint/30 relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline pointer-events-none" />

      {/* Step readout */}
      <div className="font-mono text-accent text-lg sm:text-2xl font-bold tracking-[0.15em] mb-8 relative z-10">
        {steps[stepIndex]}
        <span className="cursor-blink" />
      </div>

      {/* Progress bar */}
      <div className="w-48 sm:w-64 h-[3px] bg-ink-faint/20 relative z-10">
        <div 
          className="h-full bg-accent transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="mt-6 font-mono text-[10px] text-ink-faint tracking-[0.3em] uppercase relative z-10">
        Step {stepIndex + 1} / {steps.length}
      </div>
    </div>
  );
}
