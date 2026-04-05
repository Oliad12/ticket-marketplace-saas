"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DollarSign, Ticket, CalendarDays, TrendingUp, RefreshCw } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/Spinner";
import Link from "next/link";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export default function SellerOverviewTab({ userId }: { userId: string }) {
  const earnings = useQuery(api.admin.getSellerEarnings, { userId });
  const events = useQuery(api.events.getSellerEvents, { userId });

  if (!earnings || !events) return <div className="flex justify-center py-16"><Spinner /></div>;

  type Earnings = {
    totalEarnings: number; revenueToday?: number; totalTicketsSold: number;
    netEarnings: number; stripeRevenue: number; chapaRevenue: number;
    perEvent: Array<{ eventId: string; eventName: string; eventDate: number; ticketsSold: number; revenue: number; currency: string }>;
  };
  const e = earnings as Earnings;

  const activeEvents = events.filter((ev) => !ev.is_cancelled && ev.eventDate > Date.now());

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total Earnings" value={`ETB ${fmt(e.totalEarnings)}`} icon={DollarSign} color="green" sub="All time revenue" />
        <StatCard label="Tickets Sold" value={e.totalTicketsSold} icon={Ticket} color="blue" sub="Valid + used" />
        <StatCard label="Active Events" value={activeEvents.length} icon={CalendarDays} color="purple" sub="Upcoming events" />
        <StatCard label="Net Earnings" value={`ETB ${fmt(e.netEarnings)}`} icon={TrendingUp} color="teal" sub="After refunds" />
      </div>

      {/* Payment breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-purple-50 p-2 rounded-lg"><RefreshCw className="w-4 h-4 text-purple-600" /></div>
            <p className="font-semibold text-gray-900 text-sm">Stripe Revenue</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">ETB {fmt(e.stripeRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-yellow-50 p-2 rounded-lg"><RefreshCw className="w-4 h-4 text-yellow-600" /></div>
            <p className="font-semibold text-gray-900 text-sm">Chapa Revenue</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">ETB {fmt(e.chapaRevenue)}</p>
        </div>
      </div>

      {/* Top events */}
      {e.perEvent.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm">Event Performance</h3>
            <Link href="/seller/events" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {e.perEvent.slice(0, 5).map((ev) => (
              <div key={ev.eventId} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{ev.eventName}</p>
                  <p className="text-xs text-gray-400">{new Date(ev.eventDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">ETB {fmt(ev.revenue)}</p>
                  <p className="text-xs text-gray-400">{ev.ticketsSold} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
