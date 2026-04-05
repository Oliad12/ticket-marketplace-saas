"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Ticket, Store } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-[#026CDF] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Buyer CTA */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 text-white">
            <div className="bg-white/20 p-3 rounded-xl inline-flex mb-4">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-extrabold mb-2">Find Your Next Event</h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Thousands of events across Ethiopia. Concerts, sports, comedy, conferences — all in one place.
            </p>
            <Link
              href="#events"
              className="inline-flex items-center gap-2 bg-white text-[#026CDF] font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
            >
              Browse Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Seller CTA */}
          <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl p-8 text-white">
            <div className="bg-white/10 p-3 rounded-xl inline-flex mb-4">
              <Store className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-extrabold mb-2">Start Selling Tickets</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Create your event in minutes. Accept payments via Chapa or Stripe. No setup fees, no hidden costs.
            </p>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="inline-flex items-center gap-2 bg-[#026CDF] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/seller/dashboard"
                className="inline-flex items-center gap-2 bg-[#026CDF] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm"
              >
                Go to Seller Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </SignedIn>
          </div>
        </div>
      </div>
    </section>
  );
}
