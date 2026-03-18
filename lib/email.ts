import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Ticketr <noreply@yourdomain.com>";

export async function sendTicketConfirmation({
  to,
  name,
  eventName,
  eventDate,
  location,
  ticketId,
  amount,
  currency,
}: {
  to: string;
  name: string;
  eventName: string;
  eventDate: number;
  location: string;
  ticketId: string;
  amount: number;
  currency?: string;
}) {
  const symbol = currency === "etb" ? "ETB" : currency === "usd" ? "$" : "£";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your ticket for ${eventName} is confirmed!`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h1 style="color:#2563eb">🎉 Ticket Confirmed!</h1>
        <p>Hi ${name},</p>
        <p>Your ticket for <strong>${eventName}</strong> has been confirmed.</p>
        <div style="background:#f3f4f6;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:4px 0">📅 <strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
          <p style="margin:4px 0">📍 <strong>Location:</strong> ${location}</p>
          <p style="margin:4px 0">💰 <strong>Amount Paid:</strong> ${symbol} ${(amount / 100).toFixed(2)}</p>
        </div>
        <a href="${appUrl}/tickets/${ticketId}"
           style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
          View Your Ticket
        </a>
        <p style="color:#6b7280;font-size:12px;margin-top:24px">
          Please arrive 30 minutes early and have your QR code ready.
        </p>
      </div>
    `,
  });
}

export async function sendOfferExpiryWarning({
  to,
  name,
  eventName,
  expiresAt,
  eventId,
}: {
  to: string;
  name: string;
  eventName: string;
  expiresAt: number;
  eventId: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const minutesLeft = Math.round((expiresAt - Date.now()) / 60000);

  await resend.emails.send({
    from: FROM,
    to,
    subject: `⏰ Your ticket offer for ${eventName} expires soon!`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h1 style="color:#d97706">⏰ Offer Expiring Soon</h1>
        <p>Hi ${name},</p>
        <p>Your ticket offer for <strong>${eventName}</strong> expires in <strong>${minutesLeft} minutes</strong>.</p>
        <a href="${appUrl}/event/${eventId}"
           style="display:inline-block;background:#d97706;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
          Complete Purchase Now
        </a>
      </div>
    `,
  });
}

export async function sendEventCancelledEmail({
  to,
  name,
  eventName,
}: {
  to: string;
  name: string;
  eventName: string;
}) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Event Cancelled: ${eventName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h1 style="color:#dc2626">Event Cancelled</h1>
        <p>Hi ${name},</p>
        <p>Unfortunately <strong>${eventName}</strong> has been cancelled.</p>
        <p>A full refund will be processed to your original payment method within 5-7 business days.</p>
      </div>
    `,
  });
}

export async function sendResalePurchaseEmail({
  to,
  name,
  eventName,
  eventDate,
  location,
  ticketId,
  price,
  currency,
}: {
  to: string;
  name: string;
  eventName: string;
  eventDate: number;
  location: string;
  ticketId: string;
  price: number;
  currency?: string;
}) {
  const symbol = currency === "etb" ? "ETB" : currency === "usd" ? "$" : "£";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Resale ticket purchased: ${eventName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h1 style="color:#2563eb">🎟️ Resale Ticket Confirmed!</h1>
        <p>Hi ${name},</p>
        <p>You've successfully purchased a resale ticket for <strong>${eventName}</strong>.</p>
        <div style="background:#f3f4f6;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:4px 0">📅 ${new Date(eventDate).toLocaleDateString()}</p>
          <p style="margin:4px 0">📍 ${location}</p>
          <p style="margin:4px 0">💰 ${symbol} ${price.toFixed(2)}</p>
        </div>
        <a href="${appUrl}/tickets/${ticketId}"
           style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
          View Ticket
        </a>
      </div>
    `,
  });
}
