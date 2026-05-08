"use client";
import { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); if(query.trim()) onSearch(query); }}
      className="w-full flex flex-col gap-4"
    >
      <label htmlFor="search" className="font-mono text-sm uppercase tracking-widest text-gray-500 font-bold">
        // Query_Input
      </label>
      <div className="relative group">
        <textarea
          id="search"
          rows={2}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="I need a quiet blender for smoothies under $100..."
          className="w-full bg-transparent border-b-4 border-black text-4xl md:text-6xl font-black placeholder:text-gray-300 focus:outline-none focus:border-[#FF4500] resize-none overflow-hidden transition-colors duration-200 py-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if(query.trim()) onSearch(query);
            }
          }}
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="font-mono text-xs text-gray-400 hidden sm:block">Press ENTER to execute</span>
        <button 
          type="submit"
          className="bg-black text-white font-mono uppercase tracking-widest px-8 py-3 text-sm hover:bg-[#FF4500] transition-colors ml-auto"
        >
          Execute Search
        </button>
      </div>
    </form>
  );
}
