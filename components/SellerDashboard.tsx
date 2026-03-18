"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { CalendarDays, Plus, CreditCard, CheckCircle } from "lucide-react";
import Link from "next/link";
import Spinner from "./Spinner";

export default function SellerDashboard() {
  const { user } = useUser();
  const stripeConnectId = useQuery(api.users.getUsersStripeConnectId, {
    userId: user?.id ?? "",
  });

  if (!user || stripeConnectId === undefined) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Seller Dashboard</h2>
          <p className="text-blue-100 mt-2">
            Create and manage your events
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Actions — always visible */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">
                Ready to sell tickets
              </h3>
            </div>
            <p className="text-green-700 text-sm mb-5">
              You can create events and accept payments via Chapa (Telebirr, CBE Birr, bank transfer).
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/seller/new-event"
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </Link>
              <Link
                href="/seller/events"
                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <CalendarDays className="w-5 h-5" />
                My Events
              </Link>
            </div>
          </div>

          {/* Stripe Connect — optional for international sellers */}
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                International Payments (Optional)
              </h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Connect a Stripe account to also accept international card payments (GBP, USD).
              Not required if you only need Chapa.
            </p>

            {stripeConnectId ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Stripe account connected</span>
              </div>
            ) : (
              <Link
                href="/seller/connect-stripe"
                className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
              >
                Connect Stripe Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
