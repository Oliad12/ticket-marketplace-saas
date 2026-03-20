import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { verifyChapaPayment } from "@/lib/chapa";
import { Id } from "@/convex/_generated/dataModel";
import Ticket from "@/components/Ticket";
import Link from "next/link";

async function TicketSuccess({
  searchParams,
}: {
  searchParams: Promise<{ tx_ref?: string; provider?: string; session_id?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const params = await searchParams;
  const convex = getConvexClient();

  // ── Chapa flow ──────────────────────────────────────────────────────────────
  if (params.provider === "chapa" && params.tx_ref) {
    const txRef = params.tx_ref;

    try {
      const verification = await verifyChapaPayment(txRef);
      const paymentOk =
        verification?.status === "success" &&
        verification?.data?.status === "success";

      if (paymentOk) {
        // Look up the waiting list entry by the txRef we stored before redirect
        const waitingEntry = await convex.query(api.waitingList.getByTxRef, { txRef });

        if (waitingEntry && waitingEntry.status === "offered") {
          // Create the ticket
          await convex.mutation(api.events.purchaseTicket, {
            eventId: waitingEntry.eventId,
            userId: waitingEntry.userId,
            waitingListId: waitingEntry._id,
            paymentInfo: {
              paymentIntentId: txRef,
              amount: Math.round((verification.data.amount ?? 0) * 100),
            },
            paymentProvider: "chapa",
          });
        }

        // Ticket already created (e.g. page refreshed) — just find it
        const tickets = await convex.query(api.events.getUserTickets, { userId });
        const ticket = tickets
          .filter((t) => t.status === "valid" && t.paymentIntentId === txRef)
          .sort((a, b) => b.purchasedAt - a.purchasedAt)[0]
          // fallback: most recent valid ticket
          ?? tickets
            .filter((t) => t.status === "valid")
            .sort((a, b) => b.purchasedAt - a.purchasedAt)[0];

        if (ticket) return <SuccessPage ticketId={ticket._id} />;
      }
    } catch (err) {
      console.error("Chapa verification error:", err);
    }

    // Payment not confirmed yet — show pending
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⏳</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Processing</h1>
          <p className="text-gray-600 mb-6">
            Your Chapa payment is being confirmed. Your ticket will appear in{" "}
            <Link href="/tickets" className="text-blue-600 underline">My Tickets</Link> shortly.
          </p>
          <Link
            href="/tickets"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to My Tickets
          </Link>
        </div>
      </div>
    );
  }

  // ── Stripe flow ─────────────────────────────────────────────────────────────
  const tickets = await convex.query(api.events.getUserTickets, { userId });
  const latestTicket = tickets
    .filter((t) => t.status === "valid")
    .sort((a, b) => b.purchasedAt - a.purchasedAt)[0];
  if (!latestTicket) redirect("/");

  return <SuccessPage ticketId={latestTicket._id} />;
}

function SuccessPage({ ticketId }: { ticketId: Id<"tickets"> }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Ticket Purchase Successful!
          </h1>
          <p className="mt-2 text-gray-600">
            Your ticket has been confirmed and is ready to use
          </p>
        </div>
        <Ticket ticketId={ticketId} />
      </div>
    </div>
  );
}

export default TicketSuccess;
