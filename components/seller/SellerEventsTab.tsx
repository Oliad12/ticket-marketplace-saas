"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CalendarDays, Plus, ScanLine, Edit, Ban } from "lucide-react";
import Link from "next/link";
import CancelEventButton from "@/components/CancelEventButton";
import Spinner from "@/components/Spinner";
import { formatPrice } from "@/lib/utils";

export default function SellerEventsTab({ userId }: { userId: string }) {
  const events = useQuery(api.events.getSellerEvents, { userId });

  if (!events) return <div className="flex justify-center py-16"><Spinner /></div>;

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-blue-50 p-4 rounded-full mb-4">
          <CalendarDays className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No events yet</h3>
        <p className="text-gray-500 mb-6 max-w-sm">Create your first event and start selling tickets.</p>
        <Link
          href="/seller/new-event"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
      </div>
    );
  }

  const upcoming = events.filter((e) => e.eventDate > Date.now() && !e.is_cancelled);
  const past = events.filter((e) => e.eventDate <= Date.now() || e.is_cancelled);

  const renderEvent = (event: typeof events[0]) => {
    const isPast = event.eventDate <= Date.now();
    return (
      <div
        key={event._id}
        className={`bg-white rounded-xl border p-5 ${event.is_cancelled ? "border-red-200 opacity-75" : "border-gray-100"}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{event.name}</h3>
              {event.is_cancelled && (
                <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                  <Ban className="w-3 h-3" /> Cancelled
                </span>
              )}
              {event.status === "pending" && (
                <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs rounded-full font-medium">Pending Approval</span>
              )}
              {event.status === "rejected" && (
                <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded-full font-medium">Rejected</span>
              )}
            </div>
            <p className="text-sm text-gray-500">{event.location} · {new Date(event.eventDate).toLocaleDateString()}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <span className="text-gray-700">
                <span className="font-semibold">{event.metrics.soldTickets}</span>
                <span className="text-gray-400">/{event.totalTickets} sold</span>
              </span>
              <span className="font-semibold text-gray-900">
                {formatPrice(event.metrics.revenue, event.currency)}
              </span>
              {event.metrics.reservedTickets > 0 && (
                <span className="text-yellow-600 text-xs font-medium">
                  {event.metrics.reservedTickets} reserved
                </span>
              )}
            </div>
          </div>
          {!isPast && !event.is_cancelled && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href={`/seller/events/${event._id}/scan`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ScanLine className="w-3.5 h-3.5" /> Scan
              </Link>
              <Link
                href={`/seller/events/${event._id}/edit`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </Link>
              <CancelEventButton eventId={event._id} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Upcoming ({upcoming.length})</h2>
          <div className="space-y-3">{upcoming.map(renderEvent)}</div>
        </section>
      )}
      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Past & Cancelled ({past.length})</h2>
          <div className="space-y-3">{past.map(renderEvent)}</div>
        </section>
      )}
    </div>
  );
}
