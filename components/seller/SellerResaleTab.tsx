"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RefreshCw, CalendarDays } from "lucide-react";
import Spinner from "@/components/Spinner";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  sold: "bg-blue-50 text-blue-700",
  cancelled: "bg-gray-100 text-gray-500",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export default function SellerResaleTab({ userId }: { userId: string }) {
  const listings = useQuery(api.resale.getMyListings, { userId });

  if (!listings) return <div className="flex justify-center py-16"><Spinner /></div>;

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-purple-50 p-4 rounded-full mb-4">
          <RefreshCw className="w-8 h-8 text-purple-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No resale listings</h3>
        <p className="text-gray-500 max-w-sm">
          Tickets you list for resale will appear here.
        </p>
      </div>
    );
  }

  const active = listings.filter((l) => l.status === "active");
  const sold = listings.filter((l) => l.status === "sold");
  const totalRevenue = sold.reduce((s, l) => s + l.price, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Active Listings</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{active.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Sold</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{sold.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Resale Revenue</p>
          <p className="text-2xl font-bold text-green-700 mt-1">ETB {fmt(totalRevenue)}</p>
        </div>
      </div>

      {/* Listings */}
      <div className="space-y-3">
        {listings.map((listing) => (
          <div key={listing._id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{listing.event?.name ?? "Unknown Event"}</h3>
              {listing.event && (
                <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {new Date(listing.event.eventDate).toLocaleDateString()}
                </p>
              )}
              <p className="text-sm font-semibold text-gray-900 mt-2">ETB {fmt(listing.price)}</p>
              <p className="text-xs text-gray-400 mt-0.5">Listed {new Date(listing.listedAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${STATUS_STYLES[listing.status]}`}>
              {listing.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
