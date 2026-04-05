"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import Pagination from "@/components/admin/Pagination";
import { Search, CheckCircle, XCircle, ExternalLink } from "lucide-react";

const CATEGORIES = ["all", "music", "sports", "comedy", "theatre", "conference", "festival", "other"];
const PAGE_SIZE = 15;

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

type AdminEvent = {
  _id: string; name: string; location: string; sellerName: string;
  category?: string; is_cancelled?: boolean; eventDate: number;
  ticketsSold: number; revenue: number; currency?: string;
  status?: "pending" | "approved" | "rejected"; adminNote?: string;
};

export default function AdminEventsPage() {
  const events = useQuery(api.admin.getAllEvents);
  const setEventStatus = useMutation(api.admin.setEventStatus);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [processing, setProcessing] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  if (!events) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  const filtered = (events as AdminEvent[]).filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.sellerName.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || e.category === category;
    const matchStatus =
      status === "all" ||
      (status === "active" && !e.is_cancelled) ||
      (status === "cancelled" && e.is_cancelled);
    const matchApproval =
      approvalFilter === "all" ||
      (approvalFilter === "pending" && e.status === "pending") ||
      (approvalFilter === "approved" && e.status === "approved") ||
      (approvalFilter === "rejected" && e.status === "rejected");
    return matchSearch && matchCat && matchStatus && matchApproval;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const resetPage = () => setPage(1);

  const handleApproval = async (eventId: string, newStatus: "approved" | "rejected") => {
    setProcessing(eventId);
    try {
      await setEventStatus({ eventId: eventId as Id<"events">, status: newStatus });
    } finally {
      setProcessing(null);
    }
  };

  const pendingCount = (events as AdminEvent[]).filter((e) => e.status === "pending").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Events</h1>
        <p className="text-gray-500 mt-1 text-sm">{filtered.length} of {(events as AdminEvent[]).length} events</p>
      </div>

      {pendingCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="bg-yellow-100 p-1.5 rounded-lg">
            <Search className="w-4 h-4 text-yellow-700" />
          </div>
          <p className="text-sm font-medium text-yellow-800">
            {pendingCount} event{pendingCount > 1 ? "s" : ""} pending approval
          </p>
          <button onClick={() => { setApprovalFilter("pending"); resetPage(); }} className="ml-auto text-xs text-yellow-700 font-semibold hover:underline">
            Review
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search events, location, seller..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
          />
        </div>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={category} onChange={(e) => { setCategory(e.target.value); resetPage(); }}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={status} onChange={(e) => { setStatus(e.target.value); resetPage(); }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={approvalFilter} onChange={(e) => { setApprovalFilter(e.target.value); resetPage(); }}>
          <option value="all">All Approval</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Event", "Seller", "Date", "Category", "Sold", "Revenue", "Status", "Approval", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">No events found</td></tr>
              ) : (
                paginated.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[160px] truncate">{e.name}</td>
                    <td className="px-4 py-3 text-gray-600">{e.sellerName}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{new Date(e.eventDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {e.category ? <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium capitalize">{e.category}</span> : "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">{e.ticketsSold}</td>
                    <td className="px-4 py-3 font-medium">ETB {fmt(e.revenue)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${e.is_cancelled ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                        {e.is_cancelled ? "Cancelled" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {e.status === "pending" ? (
                        <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold">Pending</span>
                      ) : e.status === "rejected" ? (
                        <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-semibold">Rejected</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">Approved</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => router.push(`/event/${e._id}`)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="View">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        {e.status !== "approved" && (
                          <button onClick={() => handleApproval(e._id, "approved")} disabled={processing === e._id} className="p-1.5 text-gray-400 hover:text-green-600 disabled:opacity-50" title="Approve">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {e.status !== "rejected" && (
                          <button onClick={() => handleApproval(e._id, "rejected")} disabled={processing === e._id} className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-50" title="Reject">
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
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
