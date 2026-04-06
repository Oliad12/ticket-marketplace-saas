import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";


function todayStart() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

export const getAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const today = todayStart();
    const [allUsers, allEvents, allTickets, allResale, allWaiting] =
      await Promise.all([
        ctx.db.query("users").collect(),
        ctx.db.query("events").collect(),
        ctx.db.query("tickets").collect(),
        ctx.db.query("resaleListings").collect(),
        ctx.db.query("waitingList").collect(),
      ]);

    const soldTickets = allTickets.filter(
      (t) => t.status === "valid" || t.status === "used"
    );
    const totalRevenue = soldTickets.reduce((sum, t) => sum + (t.amount ?? 0), 0);

    const todayBuyers = new Set(
      allTickets
        .filter((t) => t.purchasedAt >= today && (t.status === "valid" || t.status === "used"))
        .map((t) => t.userId)
    );

    const ticketsByUser = new Map<string, number>();
    for (const t of soldTickets) {
      ticketsByUser.set(t.userId, (ticketsByUser.get(t.userId) ?? 0) + 1);
    }
    const repeatCustomers = [...ticketsByUser.values()].filter((c) => c > 1).length;

    const activeTickets = allTickets.filter((t) => t.status === "valid").length;

    const soldPerEvent = new Map<string, number>();
    for (const t of soldTickets) {
      soldPerEvent.set(t.eventId, (soldPerEvent.get(t.eventId) ?? 0) + 1);
    }
    const availableTickets = allEvents
      .filter((e) => !e.is_cancelled)
      .reduce((sum, e) => sum + Math.max(0, e.totalTickets - (soldPerEvent.get(e._id) ?? 0)), 0);

    const activeResale = allResale.filter((r) => r.status === "active").length;
    const waitlistCount = allWaiting.filter(
      (w) => w.status === "waiting" || w.status === "offered"
    ).length;

    const revenueToday = allTickets
      .filter((t) => t.purchasedAt >= today && (t.status === "valid" || t.status === "used"))
      .reduce((sum, t) => sum + (t.amount ?? 0), 0);

    return {
      totalRevenue,
      revenueToday,
      totalTicketsSold: soldTickets.length,
      customersToday: todayBuyers.size,
      repeatCustomers,
      activeTickets,
      availableTickets,
      totalUsers: allUsers.length,
      totalEvents: allEvents.filter((e) => !e.is_cancelled).length,
      activeResale,
      waitlistCount,
    };
  },
});

export const getAllEvents = query({
  args: {},
  handler: async (ctx) => {
    const [events, tickets, users] = await Promise.all([
      ctx.db.query("events").collect(),
      ctx.db.query("tickets").collect(),
      ctx.db.query("users").collect(),
    ]);
    const userMap = new Map(users.map((u) => [u.userId, u.name]));
    return events.map((e) => {
      const eventTickets = tickets.filter(
        (t) => t.eventId === e._id && (t.status === "valid" || t.status === "used")
      );
      return {
        ...e,
        sellerName: userMap.get(e.userId) ?? "Unknown",
        ticketsSold: eventTickets.length,
        revenue: eventTickets.reduce((s, t) => s + (t.amount ?? 0), 0),
      };
    });
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const [users, tickets, events] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("tickets").collect(),
      ctx.db.query("events").collect(),
    ]);
    return users.map((u) => ({
      ...u,
      ticketCount: tickets.filter((t) => t.userId === u.userId).length,
      eventsCreated: events.filter((e) => e.userId === u.userId).length,
    }));
  },
});

export const getAllTickets = query({
  args: {},
  handler: async (ctx) => {
    const [tickets, events, users] = await Promise.all([
      ctx.db.query("tickets").collect(),
      ctx.db.query("events").collect(),
      ctx.db.query("users").collect(),
    ]);
    const eventMap = new Map(events.map((e) => [e._id, e.name]));
    const userMap = new Map(users.map((u) => [u.userId, u.name]));
    return tickets.map((t) => ({
      ...t,
      eventName: eventMap.get(t.eventId) ?? "Unknown",
      buyerName: userMap.get(t.userId) ?? "Unknown",
    }));
  },
});

export const getPaymentStats = query({
  args: {},
  handler: async (ctx) => {
    const tickets = await ctx.db.query("tickets").collect();
    const calc = (provider: "stripe" | "chapa") => {
      const sold = tickets.filter(
        (t) => t.paymentProvider === provider && (t.status === "valid" || t.status === "used")
      );
      const refunded = tickets.filter(
        (t) => t.paymentProvider === provider && t.status === "refunded"
      );
      return {
        revenue: sold.reduce((s, t) => s + (t.amount ?? 0), 0),
        transactionCount: sold.length,
        refundTotal: refunded.reduce((s, t) => s + (t.amount ?? 0), 0),
      };
    };
    const stripe = calc("stripe");
    const chapa = calc("chapa");
    return {
      stripe,
      chapa,
      totalRevenue: stripe.revenue + chapa.revenue,
      totalRefunds: stripe.refundTotal + chapa.refundTotal,
    };
  },
});

export const getAllResaleListings = query({
  args: {},
  handler: async (ctx) => {
    const [listings, events, users] = await Promise.all([
      ctx.db.query("resaleListings").collect(),
      ctx.db.query("events").collect(),
      ctx.db.query("users").collect(),
    ]);
    const eventMap = new Map(events.map((e) => [e._id, e.name]));
    const userMap = new Map(users.map((u) => [u.userId, u.name]));
    return listings.map((l) => ({
      ...l,
      eventName: eventMap.get(l.eventId) ?? "Unknown",
      sellerName: userMap.get(l.sellerId) ?? "Unknown",
    }));
  },
});

export const setEventStatus = mutation({
  args: {
    eventId: v.id("events"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    adminNote: v.optional(v.string()),
  },
  handler: async (ctx, { eventId, status, adminNote }) => {
    await ctx.db.patch(eventId, { status, adminNote });
  },
});

export const setUserBan = mutation({
  args: {
    userId: v.string(),
    isBanned: v.boolean(),
    banReason: v.optional(v.string()),
  },
  handler: async (ctx, { userId, isBanned, banReason }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();
    if (!user) throw new ConvexError("User not found");
    await ctx.db.patch(user._id, { isBanned, banReason });
  },
});

export const getAllReports = query({
  args: {},
  handler: async (ctx) => {
    const reports = await ctx.db.query("reports").collect();
    const users = await ctx.db.query("users").collect();
    const userMap = new Map(users.map((u) => [u.userId, u.name]));
    return reports.map((r) => ({
      ...r,
      reporterName: userMap.get(r.reportedBy) ?? "Unknown",
    }));
  },
});

export const resolveReport = mutation({
  args: {
    reportId: v.id("reports"),
    status: v.union(v.literal("resolved"), v.literal("dismissed")),
    adminNote: v.optional(v.string()),
  },
  handler: async (ctx, { reportId, status, adminNote }) => {
    await ctx.db.patch(reportId, { status, adminNote });
  },
});

export const submitReport = mutation({
  args: {
    reportedBy: v.string(),
    targetType: v.union(v.literal("event"), v.literal("user"), v.literal("ticket")),
    targetId: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("reports", {
      ...args,
      status: "open",
      createdAt: Date.now(),
    });
  },
});

export const getSellerEarnings = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const eventIds = new Set(events.map((e) => e._id));
    const allTickets = await ctx.db.query("tickets").collect();
    const myTickets = allTickets.filter((t) => eventIds.has(t.eventId));

    const soldTickets = myTickets.filter((t) => t.status === "valid" || t.status === "used");
    const refundedTickets = myTickets.filter((t) => t.status === "refunded");

    const totalEarnings = soldTickets.reduce((s, t) => s + (t.amount ?? 0), 0);
    const totalRefunded = refundedTickets.reduce((s, t) => s + (t.amount ?? 0), 0);

    const perEvent = events.map((e) => {
      const eTickets = myTickets.filter(
        (t) => t.eventId === e._id && (t.status === "valid" || t.status === "used")
      );
      return {
        eventId: e._id,
        eventName: e.name,
        eventDate: e.eventDate,
        ticketsSold: eTickets.length,
        revenue: eTickets.reduce((s, t) => s + (t.amount ?? 0), 0),
        currency: e.currency ?? "etb",
      };
    });

    const stripeRevenue = soldTickets
      .filter((t) => t.paymentProvider === "stripe")
      .reduce((s, t) => s + (t.amount ?? 0), 0);
    const chapaRevenue = soldTickets
      .filter((t) => t.paymentProvider === "chapa")
      .reduce((s, t) => s + (t.amount ?? 0), 0);

    return {
      totalEarnings,
      totalRefunded,
      netEarnings: totalEarnings - totalRefunded,
      totalTicketsSold: soldTickets.length,
      stripeRevenue,
      chapaRevenue,
      perEvent,
    };
  },
});

export const getBuyerPaymentHistory = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const events = await ctx.db.query("events").collect();
    const eventMap = new Map(events.map((e) => [e._id, e]));

    return tickets
      .filter((t) => t.amount != null)
      .map((t) => ({
        ticketId: t._id,
        eventId: t.eventId,
        eventName: eventMap.get(t.eventId)?.name ?? "Unknown",
        eventDate: eventMap.get(t.eventId)?.eventDate ?? 0,
        purchasedAt: t.purchasedAt,
        amount: t.amount ?? 0,
        paymentProvider: t.paymentProvider,
        status: t.status,
        paymentIntentId: t.paymentIntentId,
        chapaTransactionRef: t.chapaTransactionRef,
      }))
      .sort((a, b) => b.purchasedAt - a.purchasedAt);
  },
});

/** Time-series analytics: daily revenue, ticket sales, user registrations, resales, and payment breakdown */
export const getTimeSeriesAnalytics = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, { days = 30 }) => {
    const now = Date.now();
    const msPerDay = 86_400_000;
    const start = now - days * msPerDay;

    const [tickets, users, resale] = await Promise.all([
      ctx.db.query("tickets").collect(),
      ctx.db.query("users").collect(),
      ctx.db.query("resaleListings").collect(),
    ]);

    type DayEntry = {
      date: string;
      revenue: number;
      ticketsSold: number;
      newUsers: number;
      resales: number;
      stripeRevenue: number;
      chapaRevenue: number;
      newSubscribers: number;   
      recurringSubscribers: number; 
    };

    const dayMap = new Map<string, DayEntry>();
    for (let i = 0; i < days; i++) {
      const d = new Date(start + i * msPerDay);
      const key = d.toISOString().slice(0, 10);
      dayMap.set(key, {
        date: key, revenue: 0, ticketsSold: 0, newUsers: 0,
        resales: 0, stripeRevenue: 0, chapaRevenue: 0,
        newSubscribers: 0, recurringSubscribers: 0,
      });
    }

    const firstPurchase = new Map<string, number>();
    const sortedTickets = [...tickets].sort((a, b) => a.purchasedAt - b.purchasedAt);
    for (const t of sortedTickets) {
      if (!firstPurchase.has(t.userId)) firstPurchase.set(t.userId, t.purchasedAt);
    }

   
    for (const t of tickets) {
      if (t.purchasedAt < start) continue;
      const key = new Date(t.purchasedAt).toISOString().slice(0, 10);
      const entry = dayMap.get(key);
      if (!entry) continue;
      if (t.status === "valid" || t.status === "used") {
        entry.revenue += t.amount ?? 0;
        entry.ticketsSold += 1;
        if (t.paymentProvider === "stripe") entry.stripeRevenue += t.amount ?? 0;
        else if (t.paymentProvider === "chapa") entry.chapaRevenue += t.amount ?? 0;
        // New vs recurring
        const isNew = firstPurchase.get(t.userId) === t.purchasedAt;
        if (isNew) entry.newSubscribers += 1;
        else entry.recurringSubscribers += 1;
      }
    }

    // Aggregate user registrations
    for (const u of users) {
      if (u._creationTime < start) continue;
      const key = new Date(u._creationTime).toISOString().slice(0, 10);
      const entry = dayMap.get(key);
      if (!entry) continue;
      entry.newUsers += 1;
    }

    // Aggregate resale listings
    for (const r of resale) {
      if (r.listedAt < start) continue;
      const key = new Date(r.listedAt).toISOString().slice(0, 10);
      const entry = dayMap.get(key);
      if (!entry) continue;
      entry.resales += 1;
    }

    return Array.from(dayMap.values());
  },
});
