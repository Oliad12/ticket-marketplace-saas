import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    return await ctx.db
      .query("ticketTypes")
      .withIndex("by_event", (q) => q.eq("eventId", eventId))
      .collect();
  },
});

export const create = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    price: v.number(),
    totalQuantity: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ticketTypes", args);
  },
});

export const update = mutation({
  args: {
    ticketTypeId: v.id("ticketTypes"),
    name: v.string(),
    price: v.number(),
    totalQuantity: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { ticketTypeId, ...updates }) => {
    await ctx.db.patch(ticketTypeId, updates);
  },
});

export const remove = mutation({
  args: { ticketTypeId: v.id("ticketTypes") },
  handler: async (ctx, { ticketTypeId }) => {
    await ctx.db.delete(ticketTypeId);
  },
});

// Get sold count per ticket type
export const getSoldCount = query({
  args: { ticketTypeId: v.id("ticketTypes") },
  handler: async (ctx, { ticketTypeId }) => {
    const tickets = await ctx.db
      .query("tickets")
      .collect();
    return tickets.filter(
      (t) =>
        t.ticketTypeId === ticketTypeId &&
        (t.status === "valid" || t.status === "used")
    ).length;
  },
});
