"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Bell, ArrowLeft, PanelLeftClose, PanelLeftOpen, Menu } from "lucide-react";
import Link from "next/link";
import { useSidebar } from "./SidebarContext";

export default function AdminTopBar() {
  const { user } = useUser();
  const { collapsed, toggle, openMobile } = useSidebar();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile: hamburger */}
        <button
          onClick={openMobile}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop: collapse toggle */}
        <button
          onClick={toggle}
          className="hidden lg:flex p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <PanelLeftClose className="w-4 h-4" />
          }
        </button>

        <span className="text-sm font-semibold text-gray-700 hidden sm:block">
          Admin Dashboard
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        <div className="hidden sm:block text-right">
          <p className="text-xs font-semibold text-gray-900 leading-tight">{user?.fullName ?? "Admin"}</p>
          <p className="text-xs text-gray-400 truncate max-w-[140px]">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>

        <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />

        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-3 h-3" />
          <span className="hidden sm:inline">Back to site</span>
        </Link>
      </div>
    </header>
  );
}
