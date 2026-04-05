"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import Pagination from "@/components/admin/Pagination";

const PAGE_SIZE = 15;

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  sold: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-600",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

type AdminListing = {
  _id: string; eventName: string; sellerName: string;
  price: number; listedAt: number; status: "active" | "sold" | "cancelled";
};

export default function AdminResalePage() {
  const listings = useQuery(api.admin.getAllResaleListings);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  if (!listings) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  const filtered = (listings as AdminListing[]).filter(
    (l) => status === "all" || l.status === status
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Resale Listings</h1>
        <p className="text-gray-500 mt-1 text-sm">{filtered.length} of {listings.length} listings</p>
      </div>

      <div className="flex gap-3 mb-6">
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Listing ID", "Event", "Seller", "Price", "Listed Date", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No listings found</td></tr>
              ) : (
                paginated.map((l) => (
                  <tr key={l._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{l._id.slice(-8)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[160px] truncate">{l.eventName}</td>
                    <td className="px-4 py-3 text-gray-600">{l.sellerName}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">ETB {fmt(l.price)}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{new Date(l.listedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[l.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {l.status}
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
