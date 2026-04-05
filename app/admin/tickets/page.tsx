"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import Pagination from "@/components/admin/Pagination";
import { Search } from "lucide-react";

const PAGE_SIZE = 15;

const STATUS_COLORS: Record<string, string> = {
  valid: "bg-green-50 text-green-700",
  used: "bg-gray-100 text-gray-600",
  refunded: "bg-red-50 text-red-600",
  cancelled: "bg-red-50 text-red-600",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

type AdminTicket = {
  _id: string; eventName: string; buyerName: string; purchasedAt: number;
  amount?: number; paymentProvider?: "stripe" | "chapa";
  status: "valid" | "used" | "refunded" | "cancelled";
};

export default function AdminTicketsPage() {
  const tickets = useQuery(api.admin.getAllTickets);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [provider, setProvider] = useState("all");
  const [page, setPage] = useState(1);

  if (!tickets) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  const filtered = (tickets as AdminTicket[]).filter((t) => {
    const matchSearch =
      t.eventName.toLowerCase().includes(search.toLowerCase()) ||
      t.buyerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "all" || t.status === status;
    const matchProvider = provider === "all" || t.paymentProvider === provider;
    return matchSearch && matchStatus && matchProvider;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const resetPage = () => setPage(1);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tickets</h1>
        <p className="text-gray-500 mt-1 text-sm">{filtered.length} of {tickets.length} tickets</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by event or buyer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
          />
        </div>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={status} onChange={(e) => { setStatus(e.target.value); resetPage(); }}>
          <option value="all">All Status</option>
          <option value="valid">Valid</option>
          <option value="used">Used</option>
          <option value="refunded">Refunded</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={provider} onChange={(e) => { setProvider(e.target.value); resetPage(); }}>
          <option value="all">All Providers</option>
          <option value="stripe">Stripe</option>
          <option value="chapa">Chapa</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Ticket ID", "Event", "Buyer", "Date", "Amount", "Provider", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No tickets found</td></tr>
              ) : (
                paginated.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{t._id.slice(-8)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[160px] truncate">{t.eventName}</td>
                    <td className="px-4 py-3 text-gray-600">{t.buyerName}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{new Date(t.purchasedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{t.amount != null ? `ETB ${fmt(t.amount)}` : "—"}</td>
                    <td className="px-4 py-3">
                      {t.paymentProvider ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${t.paymentProvider === "stripe" ? "bg-purple-50 text-purple-700" : "bg-yellow-50 text-yellow-700"}`}>
                          {t.paymentProvider}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[t.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
