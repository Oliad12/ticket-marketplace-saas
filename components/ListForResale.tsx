"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Tag, X } from "lucide-react";

export default function ListForResale({ ticketId, eventId }: { ticketId: Id<"tickets">; eventId: Id<"events"> }) {
  const { user } = useUser();
  const event = useQuery(api.events.getById, { eventId });
  const listForResale = useMutation(api.resale.listTicketForResale);
  const cancelListing = useMutation(api.resale.cancelResaleListing);
  const myListings = useQuery(api.resale.getMyListings, { userId: user?.id ?? "" });

  const [price, setPrice] = useState("");
  const [showing, setShowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeListing = myListings?.find(
    (l) => l.ticketId === ticketId && l.status === "active"
  );

  const symbol = event?.currency === "etb" ? "ETB" : event?.currency === "usd" ? "$" : "£";

  const handleList = async () => {
    if (!user || !price) return;
    setLoading(true);
    try {
      await listForResale({ ticketId, sellerId: user.id, price: Number(price) });
      setShowing(false);
      setPrice("");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!activeListing || !user) return;
    setLoading(true);
    try {
      await cancelListing({ listingId: activeListing._id, userId: user.id });
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (activeListing) {
    return (
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div>
          <p className="text-sm font-medium text-blue-800">Listed for resale</p>
          <p className="text-sm text-blue-600">{symbol} {activeListing.price.toFixed(2)}</p>
        </div>
        <button onClick={handleCancel} disabled={loading}
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700">
          <X className="w-4 h-4" /> Cancel Listing
        </button>
      </div>
    );
  }

  return (
    <div>
      {!showing ? (
        <button onClick={() => setShowing(true)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 border border-gray-200 rounded-lg px-4 py-2 hover:border-blue-300 transition">
          <Tag className="w-4 h-4" /> List for Resale
        </button>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">Set your resale price</p>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">{symbol}</span>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00" className="border border-gray-300 rounded pl-10 pr-3 py-2 text-sm w-full" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowing(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleList} disabled={loading || !price}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Listing..." : "List Ticket"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
