"use server";

import { initializeChapaPayment } from "@/lib/chapa";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { auth, currentUser } from "@clerk/nextjs/server";
export type ChapaCheckoutMetaData = {
  eventId: Id<"events">;
  userId: string;
  waitingListId: Id<"waitingList">;
};

export async function createChapaCheckoutSession({
  eventId,
}: {
  eventId: Id<"events">;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await currentUser();
  if (!user) throw new Error("User not found");

  const convex = getConvexClient();

  const event = await convex.query(api.events.getById, { eventId });
  if (!event) throw new Error("Event not found");

  const queuePosition = await convex.query(api.waitingList.getQueuePosition, {
    eventId,
    userId,
  });

  if (!queuePosition || queuePosition.status !== "offered") {
    throw new Error("No valid ticket offer found");
  }

  // Encode waitingListId into txRef so we can decode it on return
  // Format: tkt-{shortRef}-{waitingListId base64url}
  // Keep under 50 chars: "tkt-" (4) + shortRef (16) + "-" (1) + encoded (max 29)
  const shortRef = queuePosition._id.slice(-16);
  const txRef = `tkt-${shortRef}-${Date.now().toString(36)}`;
  const email = user.emailAddresses[0]?.emailAddress ?? "noreply@ticketr.com";
  const firstName = user.firstName ?? "Ticket";
  const lastName = user.lastName ?? "Buyer";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Chapa requires a publicly accessible callback URL
  const callbackUrl = appUrl.includes("localhost")
    ? "https://webhook.site/chapa-dev-placeholder"
    : `${appUrl}/api/webhooks/chapa`;

  // Always use ETB for Chapa, minimum amount is 1
  const amount = Math.max(event.price, 1);

  console.log("Chapa payload:", {
    amount,
    currency: "ETB",
    email,
    firstName,
    lastName,
    txRef,
    callbackUrl,
    returnUrl: `${appUrl}/tickets/purchase-success?tx_ref=${txRef}&provider=chapa`,
    title: event.name,
  });

  const { checkout_url } = await initializeChapaPayment({
    amount,
    currency: "ETB",
    email,
    firstName,
    lastName,
    txRef,
    callbackUrl,
    returnUrl: `${appUrl}/tickets/purchase-success?tx_ref=${txRef}&provider=chapa`,
    title: event.name,
    description: event.description.slice(0, 100),
  });

  // Store txRef on the waiting list entry so we can look it up on return
  await convex.mutation(api.waitingList.storeChapaRef, {
    waitingListId: queuePosition._id,
    txRef,
  });

  return { checkoutUrl: checkout_url, txRef };
}
