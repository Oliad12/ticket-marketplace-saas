"use client";

import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Ticket, LayoutDashboard, ShieldCheck, Search, Store } from "lucide-react";

export default function Header() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <header className="bg-[#026CDF] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-white p-1.5 rounded">
              <Ticket className="w-4 h-4 text-[#026CDF]" />
            </div>
            <span className="font-extrabold text-lg tracking-tight hidden sm:block">
              Ticketr
            </span>
          </Link>

          <div className="flex-1" />

          <div className="flex items-center gap-1">
            {/* Search icon — always visible */}
            <Link
              href="/search"
              className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              title="Search events"
            >
              <Search className="w-5 h-5" />
            </Link>

            <SignedIn>
              {/* ── LARGE SCREENS: nav links in header ── */}
              <Link
                href="/dashboard"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                My Tickets
              </Link>
              <Link
                href="/seller/dashboard"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
              >
                <Store className="w-4 h-4" />
                Sell Tickets
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </Link>
              )}

              {/* ── LARGE SCREENS: UserButton without extra menu items ── */}
              <div className="ml-1 hidden lg:block">
                <UserButton
                  appearance={{ elements: { avatarBox: "w-9 h-9" } }}
                />
              </div>

              {/* ── SMALL SCREENS: UserButton WITH menu items ── */}
              <div className="ml-1 lg:hidden">
                <UserButton
                  appearance={{ elements: { avatarBox: "w-8 h-8" } }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="My Tickets"
                      labelIcon={<LayoutDashboard size={16} />}
                      href="/dashboard"
                    />
                    <UserButton.Link
                      label="Sell Tickets"
                      labelIcon={<Store size={16} />}
                      href="/seller/dashboard"
                    />
                    {isAdmin && (
                      <UserButton.Link
                        label="Admin Dashboard"
                        labelIcon={<ShieldCheck size={16} />}
                        href="/admin"
                      />
                    )}
                    <UserButton.Action label="manageAccount" />
                    <UserButton.Action label="signOut" />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-white text-[#026CDF] font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}
