"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { RefreshCw, CalendarDays, X } from "lucide-react";
import { useState } from "react";
import Spinner from "@/components/Spinner";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  sold: "bg-blue-50 text-blue-700",
  cancelled: "bg-gray-100 text-gray-500",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export default function ResaleTab({ userId }: { userId: string }) {
  const listings = useQuery(api.resale.getMyListings, { userId });
  const cancelListing = useMutation(api.resale.cancelResaleListing);
  const [cancelling, setCancelling] = useState<string | null>(null);

  if (listings === undefined) return <div className="flex justify-center py-16"><Spinner /></div>;

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-purple-50 p-4 rounded-full mb-4">
          <RefreshCw className="w-8 h-8 text-purple-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No resale listings</h3>
        <p className="text-gray-500 max-w-sm">
          You can list valid tickets for resale from your ticket detail page.
        </p>
      </div>
    );
  }

  const handleCancel = async (listingId: Id<"resaleListings">) => {
    setCancelling(listingId);
    try {
      await cancelListing({ listingId, userId });
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="space-y-3">
      {listings.map((listing) => (
        <div key={listing._id} className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {listing.event?.name ?? "Unknown Event"}
              </h3>
              {listing.event && (
                <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {new Date(listing.event.eventDate).toLocaleDateString()}
                </p>
              )}
              <p className="text-sm font-semibold text-gray-900 mt-2">
                ETB {fmt(listing.price)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Listed {new Date(listing.listedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[listing.status]}`}>
                {listing.status}
              </span>
              {listing.status === "active" && (
                <button
                  onClick={() => handleCancel(listing._id as Id<"resaleListings">)}
                  disabled={cancelling === listing._id}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" />
                  {cancelling === listing._id ? "Cancelling..." : "Cancel"}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
