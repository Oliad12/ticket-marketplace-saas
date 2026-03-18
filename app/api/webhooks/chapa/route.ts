import { verifyChapaPayment } from "@/lib/chapa";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Chapa calls this as a callback after payment
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const txRef = body?.tx_ref as string | undefined;

  if (!txRef) {
    return new Response("Missing tx_ref", { status: 400 });
  }

  // Verify payment with Chapa
  const verification = await verifyChapaPayment(txRef).catch(() => null);
  if (!verification || verification.status !== "success") {
    return new Response("Payment verification failed", { status: 400 });
  }

  // tx_ref format: "ticket-{waitingListId}-{timestamp}"
  const parts = txRef.split("-");
  // waitingListId is everything between first and last dash segment
  const waitingListId = parts.slice(1, -1).join("-") as Id<"waitingList">;

  const convex = getConvexClient();

  const waitingList = await convex.query(api.waitingList.getQueuePositionById, {
    waitingListId,
  });

  if (!waitingList) {
    return new Response("Waiting list entry not found", { status: 404 });
  }

  await convex.mutation(api.events.purchaseTicket, {
    eventId: waitingList.eventId,
    userId: waitingList.userId,
    waitingListId,
    paymentInfo: {
      paymentIntentId: txRef,
      amount: Math.round((verification.data?.amount ?? 0) * 100),
    },
    paymentProvider: "chapa",
  });

  return new Response(null, { status: 200 });
}

// Chapa also does a GET redirect after payment (return_url)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const txRef = searchParams.get("tx_ref");

  if (!txRef) return new Response("Missing tx_ref", { status: 400 });

  const verification = await verifyChapaPayment(txRef).catch(() => null);
  if (!verification || verification.status !== "success") {
    return Response.redirect("/");
  }

  return Response.redirect(
    `/tickets/purchase-success?tx_ref=${txRef}&provider=chapa`
  );
}
