"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { Tag, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

export default function ResaleListings({ eventId }: { eventId: Id<"events"> }) {
  const { user } = useUser();
  const listings = useQuery(api.resale.getActiveListingsForEvent, { eventId });
  const purchase = useMutation(api.resale.purchaseResaleTicket);
  const [loading, setLoading] = useState<string | null>(null);

  if (!listings || listings.length === 0) return null;

  const handleBuy = async (listingId: Id<"resaleListings">) => {
    if (!user) return;
    setLoading(listingId);
    try {
      // For now redirect to Chapa/Stripe — simplified direct purchase
      await purchase({
        listingId,
        buyerId: user.id,
        paymentIntentId: `resale-${listingId}-${Date.now()}`,
        paymentProvider: "chapa",
      });
      alert("Ticket transferred to your account!");
    } catch (e) {
      alert(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Tag className="w-5 h-5 text-blue-600" />
        Resale Tickets Available ({listings.length})
      </h3>
      <div className="space-y-3">
        {listings.map((listing) => (
          <div key={listing._id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
            <div>
              <p className="font-medium text-gray-900">
                {formatPrice(listing.price, listing.event?.currency)}
              </p>
              <p className="text-sm text-gray-500">
                Listed {new Date(listing.listedAt).toLocaleDateString()}
              </p>
            </div>
            {user && user.id !== listing.sellerId && (
              <button
                onClick={() => handleBuy(listing._id)}
                disabled={loading === listing._id}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" />
                {loading === listing._id ? "Processing..." : "Buy"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
