"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Music, Trophy, Laugh, Theater, Mic2, Globe, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  { icon: Music, label: "Music", color: "bg-pink-500" },
  { icon: Trophy, label: "Sports", color: "bg-green-500" },
  { icon: Laugh, label: "Comedy", color: "bg-yellow-500" },
  { icon: Theater, label: "Theatre", color: "bg-purple-500" },
  { icon: Mic2, label: "Conference", color: "bg-blue-500" },
  { icon: Globe, label: "Festival", color: "bg-orange-500" },
];

export default function LandingHero() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <>
      {/* ── HERO + SEARCH BAR ── */}
      <section className="bg-[#026CDF] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Ethiopia&apos;s #1 Ticket Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            All Your Live Events,{" "}
            <span className="text-yellow-300">One Place</span>
          </h1>
          <p className="text-blue-100 text-base mb-7 max-w-lg mx-auto leading-relaxed">
            Concerts, sports, comedy, theatre and more — buy tickets with confidence using Chapa or Stripe.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex max-w-xl mx-auto shadow-md rounded-lg overflow-hidden mb-5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, artists, venues..."
              className="flex-1 px-4 py-2.5 text-gray-900 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold px-5 py-2.5 transition-colors text-sm whitespace-nowrap"
            >
              Search
            </button>
          </form>

          {/* Quick CTAs */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="#events"
              className="flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              Browse Events
            </Link>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 bg-white text-[#026CDF] font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/seller/dashboard"
                className="flex items-center gap-2 bg-white text-[#026CDF] font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm"
              >
                Sell Tickets <ArrowRight className="w-4 h-4" />
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap flex-shrink-0">
              Browse by:
            </span>
            {categories.map(({ label, color }) => (
              <button
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#026CDF] hover:text-[#026CDF] hover:bg-blue-50 transition-colors whitespace-nowrap flex-shrink-0"
              >
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
