"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

type Report = {
  _id: string;
  reportedBy: string;
  reporterName: string;
  targetType: "event" | "user" | "ticket";
  targetId: string;
  reason: string;
  status: "open" | "resolved" | "dismissed";
  adminNote?: string;
  createdAt: number;
};

const STATUS_STYLES: Record<string, string> = {
  open: "bg-yellow-50 text-yellow-700",
  resolved: "bg-green-50 text-green-700",
  dismissed: "bg-gray-100 text-gray-500",
};

const TARGET_STYLES: Record<string, string> = {
  event: "bg-blue-50 text-blue-700",
  user: "bg-purple-50 text-purple-700",
  ticket: "bg-orange-50 text-orange-700",
};

export default function AdminReportsPage() {
  const reports = useQuery(api.admin.getAllReports);
  const resolveReport = useMutation(api.admin.resolveReport);
  const [statusFilter, setStatusFilter] = useState("all");
  const [processing, setProcessing] = useState<string | null>(null);

  if (!reports) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  const filtered = (reports as Report[]).filter(
    (r) => statusFilter === "all" || r.status === statusFilter
  );

  const openCount = (reports as Report[]).filter((r) => r.status === "open").length;

  const handleResolve = async (reportId: string, status: "resolved" | "dismissed") => {
    setProcessing(reportId);
    try {
      await resolveReport({ reportId: reportId as Id<"reports">, status });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Fraud</h1>
        <p className="text-gray-500 mt-1">{filtered.length} reports</p>
      </div>

      {openCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm font-medium text-red-800">
            {openCount} open report{openCount > 1 ? "s" : ""} require attention
          </p>
          <button
            onClick={() => setStatusFilter("open")}
            className="ml-auto text-xs text-red-700 font-semibold hover:underline"
          >
            View open
          </button>
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Reports</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-green-50 p-4 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports</h3>
          <p className="text-gray-500">The platform is clean.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r._id}
              className={`bg-white rounded-xl border p-5 ${r.status === "open" ? "border-red-200" : "border-gray-100"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${TARGET_STYLES[r.targetType]}`}>
                      {r.targetType}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[r.status]}`}>
                      {r.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{r.reason}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Reported by: {r.reporterName} · Target ID: {r.targetId.slice(-8)}
                  </p>
                  {r.adminNote && (
                    <p className="text-xs text-gray-600 mt-2 bg-gray-50 rounded-lg px-3 py-2">
                      Admin note: {r.adminNote}
                    </p>
                  )}
                </div>
                {r.status === "open" && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleResolve(r._id, "resolved")}
                      disabled={processing === r._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Resolve
                    </button>
                    <button
                      onClick={() => handleResolve(r._id, "dismissed")}
                      disabled={processing === r._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
