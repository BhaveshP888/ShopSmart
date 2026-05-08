"use client";
import { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); if(query.trim()) onSearch(query); }}
      className="w-full"
    >
      {/* Input label */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 transition-colors duration-300 ${isFocused ? 'bg-accent' : 'bg-ink-faint'}`} />
        <label htmlFor="search" className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-ink-muted font-bold">
          Query_Input
        </label>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id="search"
          rows={2}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="I need a 65 inch OLED TV under ₹1,00,000..."
          className={`w-full bg-transparent border-b-[3px] transition-colors duration-300
            ${isFocused ? 'border-accent' : 'border-ink'} 
            text-2xl sm:text-4xl lg:text-5xl font-extrabold 
            placeholder:text-ink-faint/40 
            focus:outline-none resize-none overflow-hidden 
            py-3 tracking-tight leading-tight`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if(query.trim()) onSearch(query);
            }
          }}
        />
      </div>

      {/* Controls row */}
      <div className="flex justify-between items-center mt-4">
        <span className="font-mono text-[10px] text-ink-faint hidden sm:flex items-center gap-2 tracking-widest uppercase">
          <kbd className="border border-ink-faint px-1.5 py-0.5 text-ink-muted">Enter</kbd>
          to execute
        </span>
        <button 
          type="submit"
          className="group relative bg-ink text-surface-elevated font-mono uppercase tracking-[0.2em] px-6 sm:px-10 py-3 sm:py-4 text-xs sm:text-sm font-bold hover:bg-accent transition-colors duration-200 ml-auto"
        >
          Execute_Search
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted group-hover:text-surface-elevated transition-colors">→</span>
        </button>
      </div>
    </form>
  );
}
