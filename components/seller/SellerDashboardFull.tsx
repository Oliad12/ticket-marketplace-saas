"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  LayoutDashboard, CalendarDays, TrendingUp,
  RefreshCw, Plus, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import SellerOverviewTab from "./SellerOverviewTab";
import SellerEventsTab from "./SellerEventsTab";
import SellerEarningsTab from "./SellerEarningsTab";
import SellerResaleTab from "./SellerResaleTab";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "events", label: "My Events", icon: CalendarDays },
  { id: "earnings", label: "Earnings", icon: TrendingUp },
  { id: "resale", label: "Resale", icon: RefreshCw },
] as const;

type Tab = (typeof TABS)[number]["id"];

export default function SellerDashboardFull() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const stripeConnectId = useQuery(api.users.getUsersStripeConnectId, {
    userId: user?.id ?? "",
  });

  if (!isLoaded || stripeConnectId === undefined) {
    return <div className="flex items-center justify-center min-h-screen"><Spinner /></div>;
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
              )}
              <div>
                <h1 className="text-lg font-bold text-gray-900">Seller Dashboard</h1>
                <p className="text-sm text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <Link
              href="/seller/new-event"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              New Event
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-5 border-b border-gray-100 -mb-px">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  activeTab === id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stripe connect banner */}
        {!stripeConnectId && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-900">Connect Stripe for international payments</p>
              <p className="text-xs text-blue-700 mt-0.5">Accept GBP/USD card payments in addition to Chapa (ETB).</p>
            </div>
            <Link
              href="/seller"
              className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-900 whitespace-nowrap"
            >
              Connect <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {activeTab === "overview" && <SellerOverviewTab userId={user.id} />}
        {activeTab === "events" && <SellerEventsTab userId={user.id} />}
        {activeTab === "earnings" && <SellerEarningsTab userId={user.id} />}
        {activeTab === "resale" && <SellerResaleTab userId={user.id} />}
      </div>
    </div>
  );
}
