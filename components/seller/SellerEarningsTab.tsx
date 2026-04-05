"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, RefreshCw } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/Spinner";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

type Earnings = {
  totalEarnings: number;
  totalRefunded: number;
  netEarnings: number;
  totalTicketsSold: number;
  stripeRevenue: number;
  chapaRevenue: number;
  perEvent: Array<{
    eventId: string;
    eventName: string;
    eventDate: number;
    ticketsSold: number;
    revenue: number;
    currency: string;
  }>;
};

export default function SellerEarningsTab({ userId }: { userId: string }) {
  const earnings = useQuery(api.admin.getSellerEarnings, { userId });

  if (!earnings) return <div className="flex justify-center py-16"><Spinner /></div>;

  const e = earnings as Earnings;

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total Earnings" value={`ETB ${fmt(e.totalEarnings)}`} icon={DollarSign} color="green" />
        <StatCard label="Net Earnings" value={`ETB ${fmt(e.netEarnings)}`} icon={TrendingUp} color="teal" sub="After refunds" />
        <StatCard label="Total Refunded" value={`ETB ${fmt(e.totalRefunded)}`} icon={TrendingDown} color="red" />
        <StatCard label="Tickets Sold" value={e.totalTicketsSold} icon={CreditCard} color="blue" />
      </div>

      {/* Provider breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-50 p-2.5 rounded-xl"><CreditCard className="w-4 h-4 text-purple-600" /></div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Stripe</p>
              <p className="text-xs text-gray-400">International cards</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">ETB {fmt(e.stripeRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-50 p-2.5 rounded-xl"><RefreshCw className="w-4 h-4 text-yellow-600" /></div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Chapa</p>
              <p className="text-xs text-gray-400">Telebirr, CBE Birr</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">ETB {fmt(e.chapaRevenue)}</p>
        </div>
      </div>

      {/* Per-event breakdown */}
      {e.perEvent.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900 text-sm">Earnings by Event</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Event", "Date", "Tickets Sold", "Revenue"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {e.perEvent.map((ev) => (
                  <tr key={ev.eventId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{ev.eventName}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(ev.eventDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{ev.ticketsSold}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">ETB {fmt(ev.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
