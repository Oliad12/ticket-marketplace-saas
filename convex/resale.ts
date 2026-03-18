import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listTicketForResale = mutation({
  args: {
    ticketId: v.id("tickets"),
    sellerId: v.string(),
    price: v.number(),
  },
  handler: async (ctx, { ticketId, sellerId, price }) => {
    const ticket = await ctx.db.get(ticketId);
    if (!ticket) throw new Error("Ticket not found");
    if (ticket.userId !== sellerId) throw new Error("Not your ticket");
    if (ticket.status !== "valid") throw new Error("Only valid tickets can be resold");

    // Check not already listed
    const existing = await ctx.db
      .query("resaleListings")
      .withIndex("by_ticket", (q) => q.eq("ticketId", ticketId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();
    if (existing) throw new Error("Ticket already listed for resale");

    return await ctx.db.insert("resaleListings", {
      ticketId,
      sellerId,
      eventId: ticket.eventId,
      price,
      status: "active",
      listedAt: Date.now(),
    });
  },
});

export const cancelResaleListing = mutation({
  args: { listingId: v.id("resaleListings"), userId: v.string() },
  handler: async (ctx, { listingId, userId }) => {
    const listing = await ctx.db.get(listingId);
    if (!listing) throw new Error("Listing not found");
    if (listing.sellerId !== userId) throw new Error("Not your listing");
    await ctx.db.patch(listingId, { status: "cancelled" });
  },
});

export const purchaseResaleTicket = mutation({
  args: {
    listingId: v.id("resaleListings"),
    buyerId: v.string(),
    paymentIntentId: v.string(),
    paymentProvider: v.union(v.literal("stripe"), v.literal("chapa")),
  },
  handler: async (ctx, { listingId, buyerId, paymentIntentId, paymentProvider }) => {
    const listing = await ctx.db.get(listingId);
    if (!listing || listing.status !== "active") throw new Error("Listing not available");

    const ticket = await ctx.db.get(listing.ticketId);
    if (!ticket || ticket.status !== "valid") throw new Error("Ticket no longer valid");

    // Transfer ticket to buyer
    await ctx.db.patch(listing.ticketId, {
      userId: buyerId,
      paymentIntentId,
      paymentProvider,
      amount: listing.price,
    });

    // Mark listing as sold
    await ctx.db.patch(listingId, { status: "sold" });

    return listing.ticketId;
  },
});

export const getActiveListingsForEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const listings = await ctx.db
      .query("resaleListings")
      .withIndex("by_event", (q) => q.eq("eventId", eventId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    return await Promise.all(
      listings.map(async (l) => {
        const ticket = await ctx.db.get(l.ticketId);
        const event = await ctx.db.get(l.eventId);
        return { ...l, ticket, event };
      })
    );
  },
});

export const getMyListings = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const listings = await ctx.db
      .query("resaleListings")
      .withIndex("by_seller", (q) => q.eq("sellerId", userId))
      .collect();

    return await Promise.all(
      listings.map(async (l) => {
        const event = await ctx.db.get(l.eventId);
        return { ...l, event };
      })
    );
  },
});
