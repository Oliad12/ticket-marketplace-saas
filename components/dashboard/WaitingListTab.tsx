"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Clock, CalendarDays, MapPin, Zap } from "lucide-react";
import Link from "next/link";
import Spinner from "@/components/Spinner";

const STATUS_STYLES: Record<string, string> = {
  waiting: "bg-yellow-50 text-yellow-700",
  offered: "bg-green-50 text-green-700",
  purchased: "bg-blue-50 text-blue-700",
  expired: "bg-gray-100 text-gray-500",
};

export default function WaitingListTab({ userId }: { userId: string }) {
  const entries = useQuery(api.events.getUserWaitingList, { userId });

  if (entries === undefined) return <div className="flex justify-center py-16"><Spinner /></div>;

  const active = entries.filter((e) => e.status === "waiting" || e.status === "offered");
  const past = entries.filter((e) => e.status === "purchased" || e.status === "expired");

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-yellow-50 p-4 rounded-full mb-4">
          <Clock className="w-8 h-8 text-yellow-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No waiting list entries</h3>
        <p className="text-gray-500 max-w-sm">
          When events are sold out, you can join the waiting list and get notified when tickets become available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {active.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Active ({active.length})</h2>
          <div className="space-y-3">
            {active.map((entry) => (
              <div
                key={entry._id}
                className={`bg-white rounded-xl border p-5 ${entry.status === "offered" ? "border-green-200 shadow-sm" : "border-gray-100"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {entry.status === "offered" && (
                        <Zap className="w-4 h-4 text-green-600 flex-shrink-0" />
                      )}
                      <h3 className="font-semibold text-gray-900 truncate">
                        {entry.event?.name ?? "Unknown Event"}
                      </h3>
                    </div>
                    {entry.event && (
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {new Date(entry.event.eventDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {entry.event.location}
                        </span>
                      </div>
                    )}
                    {entry.status === "offered" && entry.offerExpiresAt && (
                      <p className="text-sm text-green-700 font-medium mt-2">
                        Offer expires: {new Date(entry.offerExpiresAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[entry.status]}`}>
                      {entry.status}
                    </span>
                    {entry.status === "offered" && entry.event && (
                      <Link
                        href={`/event/${entry.event._id}`}
                        className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Buy Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4">History ({past.length})</h2>
          <div className="space-y-2">
            {past.map((entry) => (
              <div key={entry._id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 text-sm">{entry.event?.name ?? "Unknown Event"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {entry.event ? new Date(entry.event.eventDate).toLocaleDateString() : ""}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[entry.status]}`}>
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
