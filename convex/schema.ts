import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const EVENT_CATEGORIES = [
  "music",
  "sports",
  "comedy",
  "theatre",
  "conference",
  "festival",
  "other",
] as const;

export default defineSchema({
  events: defineTable({
    name: v.string(),
    description: v.string(),
    location: v.string(),
    eventDate: v.number(),
    startDateTime: v.optional(v.number()),
    endDateTime: v.optional(v.number()),
    price: v.number(),
    totalTickets: v.number(),
    userId: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    is_cancelled: v.optional(v.boolean()),
    currency: v.optional(v.union(v.literal("gbp"), v.literal("usd"), v.literal("etb"))),
    category: v.optional(v.union(
      v.literal("music"), v.literal("sports"), v.literal("comedy"),
      v.literal("theatre"), v.literal("conference"), v.literal("festival"),
      v.literal("other")
    )),
    isFeatured: v.optional(v.boolean()),
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
    adminNote: v.optional(v.string()),
  }).index("by_category", ["category"]),

  ticketTypes: defineTable({
    eventId: v.id("events"),
    name: v.string(),        // e.g. "VIP", "General", "Student"
    price: v.number(),
    totalQuantity: v.number(),
    description: v.optional(v.string()),
  }).index("by_event", ["eventId"]),

  tickets: defineTable({
    eventId: v.id("events"),
    userId: v.string(),
    purchasedAt: v.number(),
    status: v.union(
      v.literal("valid"),
      v.literal("used"),
      v.literal("refunded"),
      v.literal("cancelled")
    ),
    paymentIntentId: v.optional(v.string()),
    amount: v.optional(v.number()),
    paymentProvider: v.optional(v.union(v.literal("stripe"), v.literal("chapa"))),
    chapaTransactionRef: v.optional(v.string()),
    ticketTypeId: v.optional(v.id("ticketTypes")),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_user_event", ["userId", "eventId"])
    .index("by_payment_intent", ["paymentIntentId"])
    .index("by_chapa_ref", ["chapaTransactionRef"]),

  waitingList: defineTable({
    eventId: v.id("events"),
    userId: v.string(),
    status: v.union(
      v.literal("waiting"),
      v.literal("offered"),
      v.literal("purchased"),
      v.literal("expired")
    ),
    offerExpiresAt: v.optional(v.number()),
    ticketTypeId: v.optional(v.id("ticketTypes")),
    chapaTransactionRef: v.optional(v.string()),
  })
    .index("by_event_status", ["eventId", "status"])
    .index("by_user_event", ["userId", "eventId"])
    .index("by_user", ["userId"]),

  resaleListings: defineTable({
    ticketId: v.id("tickets"),
    sellerId: v.string(),
    eventId: v.id("events"),
    price: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("sold"),
      v.literal("cancelled")
    ),
    listedAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_seller", ["sellerId"])
    .index("by_ticket", ["ticketId"])
    .index("by_status", ["status"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    userId: v.string(),
    stripeConnectId: v.optional(v.string()),
    isBanned: v.optional(v.boolean()),
    banReason: v.optional(v.string()),
  })
    .index("by_user_id", ["userId"])
    .index("by_email", ["email"]),

  reports: defineTable({
    reportedBy: v.string(),       // userId of reporter
    targetType: v.union(v.literal("event"), v.literal("user"), v.literal("ticket")),
    targetId: v.string(),
    reason: v.string(),
    status: v.union(v.literal("open"), v.literal("resolved"), v.literal("dismissed")),
    adminNote: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_target", ["targetType", "targetId"]),
});
