"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrl } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { CalendarDays, MapPin, ArrowRight, Ticket } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CATEGORY_COLORS: Record<string, string> = {
  music: "bg-pink-500",
  sports: "bg-green-500",
  comedy: "bg-yellow-500",
  theatre: "bg-purple-500",
  conference: "bg-blue-500",
  festival: "bg-orange-500",
  other: "bg-gray-500",
};

function FeaturedCard({ eventId }: { eventId: Id<"events"> }) {
  const router = useRouter();
  const event = useQuery(api.events.getById, { eventId });
  const availability = useQuery(api.events.getEventAvailability, { eventId });
  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) return null;

  const isSoldOut = availability.purchasedCount >= availability.totalTickets;
  const dotColor = CATEGORY_COLORS[event.category ?? "other"] ?? "bg-gray-500";

  return (
    <div
      onClick={() => router.push(`/event/${eventId}`)}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#026CDF]/30 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-[#026CDF]/10 to-blue-50 flex-shrink-0">
        {imageUrl ? (
          <Image src={imageUrl} alt={event.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Ticket className="w-12 h-12 text-[#026CDF]/30" />
          </div>
        )}
        {/* Category badge */}
        {event.category && (
          <div className="absolute top-3 left-3">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white ${dotColor}`}>
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </span>
          </div>
        )}
        {/* Sold out overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
              Sold Out
            </span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 group-hover:text-[#026CDF] transition-colors mb-2">
          {event.name}
        </h3>

        <div className="space-y-1.5 mb-3 flex-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <CalendarDays className="w-3.5 h-3.5 flex-shrink-0 text-[#026CDF]" />
            <span>
              {new Date(event.eventDate).toLocaleDateString("en-US", {
                weekday: "short", month: "short", day: "numeric", year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#026CDF]" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div>
            <p className="text-xs text-gray-400">From</p>
            <p className="text-base font-extrabold text-gray-900">
              {formatPrice(event.price, event.currency)}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/event/${eventId}`); }}
            disabled={isSoldOut}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              isSoldOut
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#026CDF] text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
            }`}
          >
            {isSoldOut ? "Sold Out" : "Book Now"}
            {!isSoldOut && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedEvents() {
  const events = useQuery(api.events.getFeatured);

  // Don't render section if no featured events
  if (events === undefined) return null;
  if (events.length === 0) return null;

  return (
    <section className="bg-white py-10 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Featured Events</h2>
            <p className="text-sm text-gray-500 mt-0.5">Hand-picked popular events you won&apos;t want to miss</p>
          </div>
          <a
            href="#events"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#026CDF] hover:underline"
          >
            View all <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {events.map((event) => (
            <FeaturedCard key={event._id} eventId={event._id} />
          ))}
        </div>
      </div>
    </section>
  );
}
