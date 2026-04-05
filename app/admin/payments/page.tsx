"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import StatCard from "@/components/admin/StatCard";
import { DollarSign, CreditCard, RefreshCw, TrendingDown } from "lucide-react";
import Spinner from "@/components/Spinner";

function fmt(n: number) {
  return `ETB ${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`;
}

export default function AdminPaymentsPage() {
  const stats = useQuery(api.admin.getPaymentStats);

  if (!stats) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 mt-1">Revenue breakdown by payment provider</p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <StatCard label="Total Revenue" value={fmt(stats.totalRevenue)} icon={DollarSign} color="green" sub="Stripe + Chapa combined" />
        <StatCard label="Total Refunds" value={fmt(stats.totalRefunds)} icon={TrendingDown} color="red" sub="All refunded amounts" />
      </div>

      {/* Provider breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stripe */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-purple-50 p-2.5 rounded-xl">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Stripe</h2>
              <p className="text-xs text-gray-400">International card payments</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-sm text-gray-500">Revenue</span>
              <span className="font-bold text-gray-900">{fmt(stats.stripe.revenue)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-sm text-gray-500">Transactions</span>
              <span className="font-bold text-gray-900">{stats.stripe.transactionCount}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-500">Refunds</span>
              <span className="font-bold text-red-600">{fmt(stats.stripe.refundTotal)}</span>
            </div>
          </div>
        </div>

        {/* Chapa */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-yellow-50 p-2.5 rounded-xl">
              <RefreshCw className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Chapa</h2>
              <p className="text-xs text-gray-400">Telebirr, CBE Birr, bank transfer</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-sm text-gray-500">Revenue</span>
              <span className="font-bold text-gray-900">{fmt(stats.chapa.revenue)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-sm text-gray-500">Transactions</span>
              <span className="font-bold text-gray-900">{stats.chapa.transactionCount}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-500">Refunds</span>
              <span className="font-bold text-red-600">{fmt(stats.chapa.refundTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
