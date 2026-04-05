"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TicketCard from "@/components/TicketCard";
import Link from "next/link";
import { Ticket, ShoppingBag } from "lucide-react";
import Spinner from "@/components/Spinner";

export default function MyTicketsTab({ userId }: { userId: string }) {
  const tickets = useQuery(api.events.getUserTickets, { userId });

  if (tickets === undefined) return <div className="flex justify-center py-16"><Spinner /></div>;

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-blue-50 p-4 rounded-full mb-4">
          <Ticket className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets yet</h3>
        <p className="text-gray-500 mb-6 max-w-sm">
          Browse upcoming events and grab your tickets before they sell out.
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse Events
        </Link>
      </div>
    );
  }

  const valid = tickets.filter((t) => t.status === "valid" && t.event && t.event.eventDate > Date.now());
  const past = tickets.filter((t) => t.status === "valid" && t.event && t.event.eventDate <= Date.now());
  const other = tickets.filter((t) => t.status !== "valid");

  return (
    <div className="space-y-8">
      {valid.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Upcoming ({valid.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {valid.map((t) => (
              <TicketCard key={t._id} ticketId={t._id as Id<"tickets">} />
            ))}
          </div>
        </section>
      )}
      {past.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Past Events ({past.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map((t) => (
              <TicketCard key={t._id} ticketId={t._id as Id<"tickets">} />
            ))}
          </div>
        </section>
      )}
      {other.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Other ({other.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {other.map((t) => (
              <TicketCard key={t._id} ticketId={t._id as Id<"tickets">} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
