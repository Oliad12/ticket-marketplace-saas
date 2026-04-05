"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events..."
          className="w-full py-2 px-4 pl-9 bg-white/15 text-white placeholder-white/60 rounded-lg border border-white/20 focus:outline-none focus:bg-black focus:text-white focus:placeholder-white transition-all duration-200 text-sm"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4 cursor-pointer" />
      </form>
    </div>
  );
}
