"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Ticket, Clock, RefreshCw, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import MyTicketsTab from "./MyTicketsTab";
import WaitingListTab from "./WaitingListTab";
import ResaleTab from "./ResaleTab";
import PaymentHistoryTab from "./PaymentHistoryTab";
import Spinner from "@/components/Spinner";

const TABS = [
  { id: "tickets", label: "My Tickets", icon: Ticket },
  { id: "waiting", label: "Waiting List", icon: Clock },
  { id: "resale", label: "Resale", icon: RefreshCw },
  { id: "payments", label: "Payment History", icon: CreditCard },
] as const;

type Tab = (typeof TABS)[number]["id"];

export default function UserDashboard() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("tickets");

  if (!isLoaded) return <div className="flex items-center justify-center min-h-screen"><Spinner /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            {user.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.imageUrl} alt={user.fullName ?? ""} className="w-12 h-12 rounded-full object-cover" />
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Welcome back, {user.firstName ?? user.fullName ?? "there"}
              </h1>
              <p className="text-sm text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 border-b border-gray-100 -mb-px">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "tickets" && <MyTicketsTab userId={user.id} />}
        {activeTab === "waiting" && <WaitingListTab userId={user.id} />}
        {activeTab === "resale" && <ResaleTab userId={user.id} />}
        {activeTab === "payments" && <PaymentHistoryTab userId={user.id} />}
      </div>
    </div>
  );
}
