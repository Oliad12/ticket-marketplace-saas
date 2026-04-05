"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreditCard, CalendarDays } from "lucide-react";
import Spinner from "@/components/Spinner";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  valid: "bg-green-50 text-green-700",
  used: "bg-gray-100 text-gray-600",
  refunded: "bg-red-50 text-red-600",
  cancelled: "bg-red-50 text-red-600",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export default function PaymentHistoryTab({ userId }: { userId: string }) {
  const history = useQuery(api.admin.getBuyerPaymentHistory, { userId });

  if (history === undefined) return <div className="flex justify-center py-16"><Spinner /></div>;

  if (!history || (history as unknown[]).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-blue-50 p-4 rounded-full mb-4">
          <CreditCard className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No payment history</h3>
        <p className="text-gray-500 max-w-sm">Your ticket purchases will appear here.</p>
      </div>
    );
  }

  type PaymentRecord = {
    ticketId: string;
    eventId: string;
    eventName: string;
    eventDate: number;
    purchasedAt: number;
    amount: number;
    paymentProvider?: string;
    status: string;
    paymentIntentId?: string;
    chapaTransactionRef?: string;
  };

  const payments = history as PaymentRecord[];
  const totalSpent = payments
    .filter((p) => p.status === "valid" || p.status === "used")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Total Spent</p>
          <p className="text-xl font-bold text-gray-900 mt-1">ETB {fmt(totalSpent)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Transactions</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{payments.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Refunded</p>
          <p className="text-xl font-bold text-red-600 mt-1">
            ETB {fmt(payments.filter((p) => p.status === "refunded").reduce((s, p) => s + p.amount, 0))}
          </p>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Event", "Date", "Amount", "Provider", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((p) => (
                <tr key={p.ticketId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">{p.eventName}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {new Date(p.purchasedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">ETB {fmt(p.amount)}</td>
                  <td className="px-4 py-3">
                    {p.paymentProvider ? (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${p.paymentProvider === "stripe" ? "bg-purple-50 text-purple-700" : "bg-yellow-50 text-yellow-700"}`}>
                        {p.paymentProvider}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[p.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/tickets/${p.ticketId}`} className="text-xs text-blue-600 hover:underline font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
