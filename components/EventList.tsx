"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Spinner from "./Spinner";
import CategoryFilter from "./CategoryFilter";
import { Ticket, CalendarDays, MapPin, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrl } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Image from "next/image";

const PAGE_SIZE = 10;

function EventRow({ eventId }: { eventId: Id<"events"> }) {
  const router = useRouter();
  const event = useQuery(api.events.getById, { eventId });
  const availability = useQuery(api.events.getEventAvailability, { eventId });
  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) return null;

  const isSoldOut = availability.purchasedCount >= availability.totalTickets;
  const isPast = event.eventDate < Date.now();

  return (
    <div
      onClick={() => router.push(`/event/${eventId}`)}
      className="group flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:border-[#026CDF] hover:shadow-md transition-all cursor-pointer"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={event.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#026CDF]/20 to-blue-100">
            <Ticket className="w-8 h-8 text-[#026CDF]/50" />
          </div>
        )}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-bold">SOLD OUT</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {event.category && (
              <span className="text-xs font-semibold text-[#026CDF] uppercase tracking-wide">
                {event.category}
              </span>
            )}
            <h3 className="font-bold text-gray-900 text-base leading-tight truncate group-hover:text-[#026CDF] transition-colors">
              {event.name}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <CalendarDays className="w-3.5 h-3.5" />
                {new Date(event.eventDate).toLocaleDateString("en-US", {
                  weekday: "short", month: "short", day: "numeric",
                })}
                {event.startDateTime && (
                  <> · {new Date(event.startDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</>
                )}
                {isPast && <span className="text-gray-400 ml-1">(Ended)</span>}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5" />
                {event.location}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className="text-base font-bold text-gray-900">
              {formatPrice(event.price, event.currency)}
            </span>
            {!isSoldOut && !isPast ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-[#026CDF] group-hover:underline">
                Get Tickets <ArrowRight className="w-3 h-3" />
              </span>
            ) : isSoldOut ? (
              <span className="text-xs font-semibold text-red-500">Sold Out</span>
            ) : null}
          </div>
        </div>

        {!isPast && !isSoldOut && (
          <div className="mt-2">
            <div className="w-full bg-gray-100 rounded-full h-1">
              <div
                className="bg-[#026CDF] h-1 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (availability.purchasedCount / availability.totalTickets) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {availability.totalTickets - availability.purchasedCount} of {availability.totalTickets} remaining
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Pagination({
  page, totalPages, onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  // Show max 5 page numbers with ellipsis logic
  const getVisible = () => {
    if (totalPages <= 5) return pages;
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) return pages.slice(-5);
    return [page - 2, page - 1, page, page + 1, page + 2];
  };
  const visible = getVisible();

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {/* Prev */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* First page + ellipsis */}
      {visible[0] > 1 && (
        <>
          <button onClick={() => onChange(1)} className="w-9 h-9 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">1</button>
          {visible[0] > 2 && <span className="px-1 text-gray-400 text-sm">…</span>}
        </>
      )}

      {/* Page numbers */}
      {visible.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            "w-9 h-9 rounded-lg border text-sm font-medium transition-colors",
            p === page
              ? "bg-[#026CDF] border-[#026CDF] text-white"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          )}
        >
          {p}
        </button>
      ))}

      {/* Last page + ellipsis */}
      {visible[visible.length - 1] < totalPages && (
        <>
          {visible[visible.length - 1] < totalPages - 1 && <span className="px-1 text-gray-400 text-sm">…</span>}
          <button onClick={() => onChange(totalPages)} className="w-9 h-9 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">{totalPages}</button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function EventList() {
  const events = useQuery(api.events.get);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  if (!events) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const filtered = selectedCategory === "all"
    ? events
    : events.filter((e) => e.category === selectedCategory);

  const upcoming = filtered
    .filter((e) => e.eventDate > Date.now())
    .sort((a, b) => a.eventDate - b.eventDate);

  const past = filtered
    .filter((e) => e.eventDate <= Date.now())
    .sort((a, b) => b.eventDate - a.eventDate);

  const upcomingTotalPages = Math.ceil(upcoming.length / PAGE_SIZE);
  const pastTotalPages = Math.ceil(past.length / PAGE_SIZE);

  const upcomingPage_ = Math.min(upcomingPage, upcomingTotalPages || 1);
  const pastPage_ = Math.min(pastPage, pastTotalPages || 1);

  const upcomingSlice = upcoming.slice((upcomingPage_ - 1) * PAGE_SIZE, upcomingPage_ * PAGE_SIZE);
  const pastSlice = past.slice((pastPage_ - 1) * PAGE_SIZE, pastPage_ * PAGE_SIZE);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setUpcomingPage(1);
    setPastPage(1);
  };

  return (
    <div id="events" className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <span className="text-sm text-gray-500 font-medium">
            {upcoming.length} event{upcoming.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Category filter */}
        <div className="mb-6">
          <CategoryFilter selected={selectedCategory} onChange={handleCategoryChange} />
        </div>

        {/* Upcoming events */}
        {upcoming.length > 0 ? (
          <>
            <div className="space-y-3 mb-4">
              {upcomingSlice.map((e) => (
                <EventRow key={e._id} eventId={e._id} />
              ))}
            </div>
            <Pagination
              page={upcomingPage_}
              totalPages={upcomingTotalPages}
              onChange={(p) => { setUpcomingPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          </>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center mb-12">
            <Ticket className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-700">No events in this category</h3>
            <p className="text-sm text-gray-400 mt-1">Try a different category or check back later</p>
          </div>
        )}

        {/* Past events */}
        {past.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Past Events
              <span className="text-sm font-normal text-gray-400 ml-2">({past.length})</span>
            </h2>
            <div className="space-y-3 opacity-70">
              {pastSlice.map((e) => (
                <EventRow key={e._id} eventId={e._id} />
              ))}
            </div>
            <Pagination
              page={pastPage_}
              totalPages={pastTotalPages}
              onChange={setPastPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
