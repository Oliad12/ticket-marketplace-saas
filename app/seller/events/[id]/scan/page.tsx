"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TicketScanner from "@/components/TicketScanner";
import Link from "next/link";
import { ArrowLeft, ScanLine } from "lucide-react";

export default function ScanTicketsPage() {
  const params = useParams();
  const { user } = useUser();
  const eventId = params.id as Id<"events">;
  const event = useQuery(api.events.getById, { eventId });

  if (!event || !user) return null;

  // Only the event owner can scan
  if (event.userId !== user.id) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center text-red-600">
        You are not authorized to scan tickets for this event.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href={`/seller/events`}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ScanLine className="w-6 h-6 text-blue-600" />
              Scan Tickets
            </h1>
            <p className="text-gray-500 text-sm mt-1">{event.name}</p>
          </div>
        </div>

        {/* Scanner */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-4 text-center">
            Point the camera at an attendee&apos;s ticket QR code to validate it.
          </p>
          <TicketScanner eventId={eventId} sellerId={user.id} />
        </div>
      </div>
    </div>
  );
}
