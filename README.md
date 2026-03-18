# Ticketr — Ethiopian Event Ticketing Platform

A full-stack, real-time event ticketing platform built for the Ethiopian market. Supports Chapa (ETB) as the primary payment method and Stripe as an optional international payment option. Built with Next.js 15, Convex, Clerk, and Tailwind CSS.

---

## Features

### For Event Attendees

- 🎫 Real-time ticket availability tracking
- ⚡ Smart queue system with time-limited offers
- � Pay with **Chapa** (Ethiopian Birr) or Stripe (international)
- 📲 Digital tickets with QR codes
- �  Resale marketplace — buy and sell tickets peer-to-peer
- 🗂️ View all your tickets in one place
- 💸 Automatic refunds for cancelled events

### For Event Organizers

- � Crteate events immediately — no Stripe Connect required
- 🎟️ Multiple ticket types (VIP, General, Student, etc.) with individual pricing
- �️ Start and end date/timen per event
- �️ Evetnt categories (Music, Sports, Comedy, Theatre, Conference, Festival, Other)
- 💰 ETB, GBP, or USD pricing
- � Real-timen sales metrics per event
- 📷 QR code ticket scanner for entry validation
- ❌ Event cancellation with automatic refunds
- 🔄 Bulk refund processing

### Technical Features

- ⚡ Real-time updates via Convex
- 🔐 Authentication with Clerk
- � RChapa payment integration (primary — ETB)
- � SRtripe payment integration (optional — international)
- � Emaila notifications via Resend (purchase confirmation, offer expiry, cancellation, resale)
- �️ Rate limiting on queue  joins
- 🔔 Toast notifications
- 📱 Fully responsive design

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Backend / DB | Convex |
| Auth | Clerk |
| Primary Payment | Chapa (ETB) |
| Secondary Payment | Stripe |
| Email | Resend |
| UI | Tailwind CSS + shadcn/ui |
| QR Scanning | @zxing/browser |

---

## Project Structure

```
app/
  actions/              # Server actions (Chapa, Stripe checkout)
  api/webhooks/         # Webhook handlers (Chapa, Stripe)
  event/[id]/           # Public event detail page
  seller/               # Seller dashboard, event management, QR scanner
  tickets/              # My tickets, ticket detail, purchase success
  search/               # Event search

components/             # All UI components
convex/                 # Database schema, queries, mutations
lib/                    # Chapa client, Stripe client, email, utils
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Convex account](https://convex.dev)
- [Clerk account](https://clerk.com)
- [Chapa account](https://chapa.co) — for ETB payments
- [Resend account](https://resend.com) — for email notifications
- Stripe account (optional — for international payments)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ticket-marketplace-saas
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=dev:your-deployment

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Chapa (primary payment — https://chapa.co)
CHAPA_SECRET_KEY=CHASECK_TEST-...
NEXT_PUBLIC_CHAPA_PUBLIC_KEY=CHAPUBK_TEST-...
CHAPA_ENCRYPTION_KEY=...

# Resend (email notifications — https://resend.com)
RESEND_API_KEY=re_...

# Stripe (optional — international payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Start Convex

```bash
npx convex dev
```

Keep this running in a separate terminal. It syncs your schema and functions automatically.

### 4. Start the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Setting Up Services

### Clerk (Authentication)

1. Create a Clerk app at [clerk.com](https://clerk.com)
2. Copy your publishable and secret keys into `.env.local`
3. Set allowed redirect URLs in the Clerk dashboard

### Convex (Database & Backend)

1. Create a project at [convex.dev](https://convex.dev)
2. Run `npx convex dev` — it will prompt you to log in and link your project
3. Your `NEXT_PUBLIC_CONVEX_URL` will be set automatically

### Chapa (Ethiopian Payments)

1. Sign up at [chapa.co](https://chapa.co)
2. Get your test keys from the dashboard
3. Add `CHAPA_SECRET_KEY`, `NEXT_PUBLIC_CHAPA_PUBLIC_KEY`, and `CHAPA_ENCRYPTION_KEY` to `.env.local`
4. For production, set your webhook URL in the Chapa dashboard to:
   ```
   https://yourdomain.com/api/webhooks/chapa
   ```

### Resend (Email Notifications)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key and add it as `RESEND_API_KEY`
3. Verify your sending domain in the Resend dashboard
4. Update the `FROM` address in `lib/email.ts`:
   ```ts
   const FROM = "Ticketr <noreply@yourdomain.com>";
   ```

### Stripe (Optional — International Payments)

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Add your keys to `.env.local`
3. For local webhook testing, use the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the displayed webhook secret into `STRIPE_WEBHOOK_SECRET`

---

## How It Works

### Buying a Ticket

1. Browse events on the homepage, filter by category
2. Click an event to view details
3. Sign in and join the queue
4. If tickets are available, you get a 15-minute offer
5. Choose payment: **Chapa (ETB)** or Stripe
6. Complete payment — ticket is created and emailed to you
7. View your QR code ticket under "My Tickets"

### Selling / Creating an Event

1. Go to the Seller Dashboard
2. Create an event — fill in name, description, location, dates, price, currency, category
3. After creating, go to Edit Event to add ticket types (VIP, General, etc.)
4. Share your event link
5. Use the QR Scanner to validate tickets at the door

### Resale Marketplace

1. Ticket holders can list their valid ticket for resale from the ticket detail page
2. Other buyers can see resale listings on the event page and purchase directly
3. The ticket is transferred to the new buyer on purchase

### Queue System

- When a user joins the queue and tickets are available, they get an **OFFERED** status with a 15-minute timer
- If they don't purchase in time, the offer expires and the next person in the waiting list is offered
- This prevents ticket hoarding and ensures fair distribution

---

## Database Schema

| Table | Purpose |
|---|---|
| `events` | Event details, dates, pricing, category, currency |
| `tickets` | Purchased tickets with payment info and QR data |
| `ticketTypes` | VIP/General/Student tiers per event |
| `waitingList` | Queue entries with offer expiry |
| `resaleListings` | Peer-to-peer resale listings |
| `users` | User profiles synced from Clerk |

---

## Key Pages

| Route | Description |
|---|---|
| `/` | Homepage with event list and category filter |
| `/event/[id]` | Event detail, queue join, resale listings |
| `/tickets` | My purchased tickets |
| `/tickets/[id]` | Individual ticket with QR code and resale option |
| `/tickets/purchase-success` | Post-payment confirmation (Chapa return) |
| `/seller` | Seller dashboard |
| `/seller/new-event` | Create a new event |
| `/seller/events/[id]/edit` | Edit event + manage ticket types
 |
| `/seller/events/[id]/scan` | QR code ticket scanner |
| `/search` | Search events by name/location |

---

## Email Notifications

Emails are sent automatically via Resend for:

- ✅ Ticket purchase confirmation (with ticket link)
- ⏰ Offer expiry warning (when 15-min timer is running out)
- ❌ Event cancellation notice
- 🔁 Resale ticket purchase confirmation

---

## Currency Support

| Code | Currency | Symbol |
|---|---|---|
| `etb` | Ethiopian Birr | ETB (ብር) |
| `usd` | US Dollar | $ |
| `gbp` | British Pound | £ |

ETB is the default currency for all new events.

---

## License

MIT
