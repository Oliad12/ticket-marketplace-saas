import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import Stripe from "stripe";
import { StripeCheckoutMetaData } from "@/app/actions/createStripeCheckoutSession";
import { sendTicketConfirmation } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  const convex = getConvexClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata as StripeCheckoutMetaData;

    try {
      await convex.mutation(api.events.purchaseTicket, {
        eventId: metadata.eventId,
        userId: metadata.userId,
        waitingListId: metadata.waitingListId,
        paymentInfo: {
          paymentIntentId: session.payment_intent as string,
          amount: session.amount_total ?? 0,
        },
        paymentProvider: "stripe",
      });

      // Send confirmation email
      const eventData = await convex.query(api.events.getById, { eventId: metadata.eventId });
      const user = await convex.query(api.users.getUserById, { userId: metadata.userId });
      const tickets = await convex.query(api.events.getUserTickets, { userId: metadata.userId });
      const ticket = tickets.filter((t) => t.eventId === metadata.eventId).pop();

      if (eventData && user && ticket) {
        await sendTicketConfirmation({
          to: user.email,
          name: user.name,
          eventName: eventData.name,
          eventDate: eventData.eventDate,
          location: eventData.location,
          ticketId: ticket._id,
          amount: session.amount_total ?? 0,
          currency: eventData.currency,
        }).catch(console.error);
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response("Error processing webhook", { status: 500 });
    }
  }

  return new Response(null, { status: 200 });
}
