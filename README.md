# 🎟️ Ticketr — Ethiopian Event Ticketing Platform

A modern, full-stack **event ticketing marketplace** built for Ethiopia 🇪🇹, supporting local and international payments.
Ticketr enables seamless event discovery, booking, and ticket management with real-time updates and secure transactions.

---

## 🌐 Live Demo

🔗 https://your-live-demo-link.com

---

## 🚀 Highlights

* 🇪🇹 Local payments via **Chapa (Telebirr, CBE Birr)**
* 🌍 International payments via **Stripe**
* ⚡ Real-time ticket availability & waitlist system
* 🎟️ QR-based digital ticketing
* 🔄 Built-in ticket resale marketplace
* 📊 Full dashboards for Admin, Sellers, and Buyers

---

## ✨ Features

### 👤 Buyer

* 🔍 Browse and search events by category, location, or name
* ⏳ Real-time waiting list with 15-minute offer windows
* 💳 Secure checkout via Chapa (ETB) or Stripe (GBP/USD)
* 🎟️ Digital QR tickets (download & scan at entry)
* 🔄 Resell tickets via marketplace
* 📜 Payment history & ticket dashboard

---

### 🧑‍💼 Seller / Event Organizer

* ➕ Create and manage events with image uploads
* 🎫 Multiple ticket types (VIP, General, Student)
* 📈 Real-time sales and revenue analytics
* 📱 QR code ticket scanner for entry validation
* 🌍 Stripe Connect for international payouts
* 🔄 Manage resale listings

---

### 🛡️ Admin

* 📊 Platform-wide analytics (revenue, users, tickets, waitlist)
* ✅ Event approval & moderation system
* 👥 User management (ban/unban)
* 💳 Payment monitoring (Stripe vs Chapa breakdown)
* ⚠️ Fraud detection & dispute handling
* 🔄 Resale marketplace oversight
* 📱 Fully responsive dashboard UI

---

## 🧰 Tech Stack

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| Frontend       | Next.js 14 (App Router), TypeScript                |
| Styling        | Tailwind CSS, shadcn/ui                            |
| Backend        | Convex (real-time database & serverless functions) |
| Authentication | Clerk                                              |
| Payments       | Stripe, Chapa                                      |
| Email          | Resend                                             |
| Icons          | Lucide React                                       |

---

## 🏗️ System Architecture

* ⚡ **Frontend (Next.js)** communicates directly with Convex APIs
* 🗄️ **Convex** handles database, business logic, and real-time updates
* 💳 **Stripe & Chapa** process payments securely
* 🔄 Real-time updates ensure accurate ticket availability and queue handling

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* Convex account
* Clerk account
* Stripe account
* Chapa account

---

### Installation

```bash
git clone https://github.com/Oliad12/ticket-marketplace-saas.git
cd ticket-marketplace-saas
npm install
```

---

### Environment Variables

Create a `.env.local` file:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=dev:your-deployment

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Chapa
CHAPA_SECRET_KEY=CHASECK_TEST-...
NEXT_PUBLIC_CHAPA_PUBLIC_KEY=CHAPUBK_TEST-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (optional)
RESEND_API_KEY=re_...
```

---

### Running Locally

Run both frontend and backend:

```bash
# Terminal 1 — Frontend
npm run dev

# Terminal 2 — Convex backend
npx convex dev
```

App runs at 👉 http://localhost:3000

---

## 🔐 Admin Setup

1. Go to Clerk Dashboard
2. Open your user
3. Add to **Public Metadata**:

```json
{
  "role": "admin"
}
```

4. Save — admin dashboard will be unlocked at `/admin`

---

## 🔌 Webhooks Configuration

### Stripe

* Endpoint: `/api/webhooks/stripe`
* Event: `checkout.session.completed`

### Chapa

* Endpoint: `/api/webhooks/chapa`

Update these after deployment with your production domain.

---

## 📂 Project Structure

```
├── app/
│   ├── admin/          # Admin dashboard
│   ├── seller/         # Seller dashboard
│   ├── dashboard/      # Buyer dashboard
│   ├── event/[id]/     # Event details & booking
│   ├── tickets/        # Ticket management (QR)
│   ├── search/         # Event search
│   └── api/webhooks/   # Payment webhooks
├── components/
├── convex/             # Backend logic (queries, mutations, actions)
└── lib/                # Utilities (Stripe, Chapa, Email)
```

---

## 📸 Screenshots

*Add screenshots or GIFs here (Landing page, Booking, Admin dashboard, etc.)*

---

## 🚀 Deployment

### Convex

```bash
npx convex deploy
```

### Vercel

```bash
npx vercel --prod
```

Or connect GitHub repo to Vercel for CI/CD deployment.

---

## 🔮 Future Improvements

* 🌍 Multi-language support
* 📱 Mobile application
* 🎟️ Advanced seat selection
* 🔔 Email & SMS notifications
* 💸 Refund & cancellation system

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork and submit a pull request.

---

## 📜 License

MIT License — see LICENSE file.

---

## 👨‍💻 Author

**Tibebu Dereje**
Full-Stack Developer | Software Engineering 
