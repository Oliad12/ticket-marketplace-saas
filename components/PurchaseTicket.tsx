"use client";

import { createStripeCheckoutSession } from "@/app/actions/createStripeCheckoutSession";
import { createChapaCheckoutSession } from "@/app/actions/createChapaCheckoutSession";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import ReleaseTicket from "./ReleaseTicket";
import { Ticket, CreditCard } from "lucide-react";

export default function PurchaseTicket({ eventId }: { eventId: Id<"events"> }) {
  const router = useRouter();
  const { user } = useUser();
  const event = useQuery(api.events.getById, { eventId });
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  const [timeRemaining, setTimeRemaining] = useState("");
  const [isLoading, setIsLoading] = useState<"stripe" | "chapa" | null>(null);

  const offerExpiresAt = queuePosition?.offerExpiresAt ?? 0;
  const isExpired = Date.now() > offerExpiresAt;

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (isExpired) { setTimeRemaining("Expired"); return; }
      const diff = offerExpiresAt - Date.now();
      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeRemaining(minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`);
    };
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [offerExpiresAt, isExpired]);

  const [stripeError, setStripeError] = useState<string | null>(null);

  const handleStripe = async () => {
    if (!user) return;
    try {
      setStripeError(null);
      setIsLoading("stripe");
      const { sessionUrl } = await createStripeCheckoutSession({ eventId });
      if (sessionUrl) router.push(sessionUrl);
    } catch (error: any) {
      setStripeError(error?.message ?? "Stripe payment unavailable for this event.");
    } finally {
      setIsLoading(null);
    }
  };

  const handleChapa = async () => {
    if (!user) return;
    try {
      setIsLoading("chapa");
      const { checkoutUrl } = await createChapaCheckoutSession({ eventId });
      if (checkoutUrl) router.push(checkoutUrl);
    } catch (error) {
      console.error("Chapa checkout error:", error);
    } finally {
      setIsLoading(null);
    }
  };

  if (!user || !queuePosition || queuePosition.status !== "offered") return null;

  const isEtb = event?.currency === "etb" || !event?.currency;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Ticket className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ticket Reserved</h3>
              <p className="text-sm text-gray-500">Expires in {timeRemaining}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Complete your purchase before the timer expires to secure your spot.
          </p>
        </div>

        {/* Payment options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 text-center">
            Choose payment method
          </p>

          {/* Chapa — shown for ETB events */}
          {isEtb && (
            <button
              onClick={handleChapa}
              disabled={isExpired || isLoading !== null}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg font-bold shadow-md hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-lg font-bold">ቻፓ</span>
              {isLoading === "chapa" ? "Redirecting..." : "Pay with Chapa (ETB)"}
            </button>
          )}

          {/* Stripe — shown for GBP/USD events, or as alternative */}
          {!isEtb && (
            <button
              onClick={handleStripe}
              disabled={isExpired || isLoading !== null}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg font-bold shadow-md hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-5 h-5" />
              {isLoading === "stripe" ? "Redirecting..." : "Pay with Card (Stripe)"}
            </button>
          )}

          {/* Always show both as alternatives */}
          {isEtb && (
            <button
              onClick={handleStripe}
              disabled={isExpired || isLoading !== null}
              className="w-full flex items-center justify-center gap-3 border border-blue-300 text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <CreditCard className="w-4 h-4" />
              {isLoading === "stripe" ? "Redirecting..." : "Pay with International Card (Stripe)"}
            </button>
          )}
          {!isEtb && (
            <button
              onClick={handleChapa}
              disabled={isExpired || isLoading !== null}
              className="w-full flex items-center justify-center gap-3 border border-green-300 text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <span className="font-bold">ቻፓ</span>
              {isLoading === "chapa" ? "Redirecting..." : "Pay with Chapa (ETB)"}
            </button>
          )}
        </div>

        <div className="mt-2">
          <ReleaseTicket eventId={eventId} waitingListId={queuePosition._id} />
        </div>

        {stripeError && (
          <p className="text-sm text-red-600 text-center">{stripeError}</p>
        )}
      </div>
    </div>
  );
}
