"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import Pagination from "@/components/admin/Pagination";
import { Search, Store, Ban, CheckCircle } from "lucide-react";

const PAGE_SIZE = 15;

type AdminUser = {
  _id: string; name: string; email: string; userId: string;
  stripeConnectId?: string; ticketCount: number; eventsCreated: number;
  isBanned?: boolean; banReason?: string;
};

export default function AdminUsersPage() {
  const users = useQuery(api.admin.getAllUsers);
  const setUserBan = useMutation(api.admin.setUserBan);
  const [search, setSearch] = useState("");
  const [sellersOnly, setSellersOnly] = useState(false);
  const [bannedOnly, setBannedOnly] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  if (!users) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  const filtered = (users as AdminUser[]).filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchSeller = !sellersOnly || !!u.stripeConnectId;
    const matchBanned = !bannedOnly || u.isBanned;
    return matchSearch && matchSeller && matchBanned;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const resetPage = () => setPage(1);

  const handleBan = async (userId: string, isBanned: boolean) => {
    setProcessing(userId);
    try {
      await setUserBan({ userId, isBanned, banReason: isBanned ? "Banned by admin" : undefined });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-1 text-sm">{filtered.length} of {(users as AdminUser[]).length} users</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
          />
        </div>
        <button
          onClick={() => { setSellersOnly((v) => !v); resetPage(); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${sellersOnly ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
        >
          <Store className="w-4 h-4" /> Sellers only
        </button>
        <button
          onClick={() => { setBannedOnly((v) => !v); resetPage(); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${bannedOnly ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
        >
          <Ban className="w-4 h-4" /> Banned only
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Name", "Email", "Tickets", "Events", "Role", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No users found</td></tr>
              ) : (
                paginated.map((u) => (
                  <tr key={u._id} className={`hover:bg-gray-50 transition-colors ${u.isBanned ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 font-medium">{u.ticketCount}</td>
                    <td className="px-4 py-3 font-medium">{u.eventsCreated}</td>
                    <td className="px-4 py-3">
                      {u.stripeConnectId ? (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">Seller</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">Buyer</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {u.isBanned ? (
                        <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-semibold">Banned</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleBan(u.userId, !u.isBanned)}
                        disabled={processing === u.userId}
                        className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${u.isBanned ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                      >
                        {u.isBanned ? <><CheckCircle className="w-3.5 h-3.5" /> Unban</> : <><Ban className="w-3.5 h-3.5" /> Ban</>}
                      </button>
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
