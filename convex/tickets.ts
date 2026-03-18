import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserTicketForEvent = query({
  args: {
    eventId: v.id("events"),
    userId: v.string(),
  },
  handler: async (ctx, { eventId, userId }) => {
    const ticket = await ctx.db
      .query("tickets")
      .withIndex("by_user_event", (q) =>
        q.eq("userId", userId).eq("eventId", eventId)
      )
      .first();

    return ticket;
  },
});

export const getTicketWithDetails = query({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, { ticketId }) => {
    const ticket = await ctx.db.get(ticketId);
    if (!ticket) return null;

    const event = await ctx.db.get(ticket.eventId);

    return {
      ...ticket,
      event,
    };
  },
});

export const getValidTicketsForEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    return await ctx.db
      .query("tickets")
      .withIndex("by_event", (q) => q.eq("eventId", eventId))
      .filter((q) =>
        q.or(q.eq(q.field("status"), "valid"), q.eq(q.field("status"), "used"))
      )
      .collect();
  },
});

export const updateTicketStatus = mutation({
  args: {
    ticketId: v.id("tickets"),
    status: v.union(
      v.literal("valid"),
      v.literal("used"),
      v.literal("refunded"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, { ticketId, status }) => {
    await ctx.db.patch(ticketId, { status });
  },
});

// Validate and mark a ticket as used — called by seller scanner
export const validateTicket = mutation({
  args: {
    ticketId: v.id("tickets"),
    eventId: v.id("events"),
    sellerId: v.string(),
  },
  handler: async (ctx, { ticketId, eventId, sellerId }) => {
    // Verify the event belongs to this seller
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Event not found");
    if (event.userId !== sellerId) throw new Error("Unauthorized");

    const ticket = await ctx.db.get(ticketId);
    if (!ticket) return { success: false, message: "Ticket not found" };
    if (ticket.eventId !== eventId)
      return { success: false, message: "Ticket is for a different event" };
    if (ticket.status === "used")
      return { success: false, message: "Ticket already used" };
    if (ticket.status === "refunded" || ticket.status === "cancelled")
      return { success: false, message: `Ticket is ${ticket.status}` };

    await ctx.db.patch(ticketId, { status: "used" });

    // Get ticket holder info
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", ticket.userId))
      .first();

    return {
      success: true,
      message: "Ticket validated successfully",
      holderName: user?.name ?? "Unknown",
      holderEmail: user?.email ?? "",
    };
  },
});
