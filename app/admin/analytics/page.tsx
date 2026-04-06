"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Spinner from "@/components/Spinner";
import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, Users, Ticket, DollarSign, RefreshCw, UserCheck } from "lucide-react";

// ── Range options ──────────────────────────────────────────────
const RANGES = [
  { label: "7D",  value: 7 },
  { label: "30D", value: 30 },
  { label: "90D", value: 90 },
  { label: "1Y",  value: 365 },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toFixed(0);
}
function fmtETB(n: number) { return `ETB ${fmt(n)}`; }

// ── Summary card ───────────────────────────────────────────────
function Card({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
      <div className={`p-2.5 rounded-xl flex-shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ── Chart wrapper ──────────────────────────────────────────────
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

const tooltipStyle = { fontSize: 12, borderRadius: 8 };

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(30);
  const raw = useQuery(api.admin.getTimeSeriesAnalytics, { days });

  // Aggregate by week/month for larger ranges
  const data = useMemo(() => {
    if (!raw) return [];
    if (days <= 30) return raw.map((d) => ({
      ...d,
      date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));
    // Group by week for 90D, by month for 1Y
    const groupBy = days >= 365 ? "month" : "week";
    const grouped = new Map<string, typeof raw[0]>();
    for (const d of raw) {
      const dt = new Date(d.date);
      const key = groupBy === "month"
        ? dt.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
        : `W${Math.ceil(dt.getDate() / 7)} ${dt.toLocaleDateString("en-US", { month: "short" })}`;
      const existing = grouped.get(key);
      if (!existing) {
        grouped.set(key, { ...d, date: key });
      } else {
        existing.revenue += d.revenue;
        existing.ticketsSold += d.ticketsSold;
        existing.newUsers += d.newUsers;
        existing.resales += d.resales;
        existing.stripeRevenue += d.stripeRevenue;
        existing.chapaRevenue += d.chapaRevenue;
        existing.newSubscribers += d.newSubscribers;
        existing.recurringSubscribers += d.recurringSubscribers;
      }
    }
    return Array.from(grouped.values());
  }, [raw, days]);

  if (!raw) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  const totalRevenue = raw.reduce((s, d) => s + d.revenue, 0);
  const totalTickets = raw.reduce((s, d) => s + d.ticketsSold, 0);
  const totalUsers = raw.reduce((s, d) => s + d.newUsers, 0);
  const totalResales = raw.reduce((s, d) => s + d.resales, 0);
  const totalNew = raw.reduce((s, d) => s + d.newSubscribers, 0);
  const totalRecurring = raw.reduce((s, d) => s + d.recurringSubscribers, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header + range selector */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1 text-sm">Deep dive into trends and patterns over time</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setDays(r.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                days === r.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <Card label="Revenue" value={fmtETB(totalRevenue)} sub={`Last ${days} days`} icon={DollarSign} color="bg-green-50 text-green-600" />
        <Card label="Tickets Sold" value={fmt(totalTickets)} sub={`Last ${days} days`} icon={Ticket} color="bg-blue-50 text-blue-600" />
        <Card label="New Users" value={fmt(totalUsers)} sub={`Last ${days} days`} icon={Users} color="bg-purple-50 text-purple-600" />
        <Card label="Resales" value={fmt(totalResales)} sub={`Last ${days} days`} icon={RefreshCw} color="bg-orange-50 text-orange-600" />
        <Card label="New Buyers" value={fmt(totalNew)} sub="First purchase" icon={UserCheck} color="bg-teal-50 text-teal-600" />
        <Card label="Repeat Buyers" value={fmt(totalRecurring)} sub="Returning" icon={TrendingUp} color="bg-pink-50 text-pink-600" />
      </div>

      {/* Row 1: Revenue over time */}
      <div className="mb-5">
        <ChartCard title="Revenue Over Time">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#026CDF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#026CDF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={fmtETB} width={70} />
              <Tooltip formatter={(v) => [fmtETB(Number(v)), "Revenue"]} contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="revenue" stroke="#026CDF" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Revenue by payment method */}
      <div className="mb-5">
        <ChartCard title="Revenue by Payment Method (Stripe vs Chapa)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={fmtETB} width={70} />
              <Tooltip formatter={(v) => [fmtETB(Number(v)), ""]} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="stripeRevenue" name="Stripe" fill="#8b5cf6" radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="chapaRevenue" name="Chapa" fill="#f59e0b" radius={[3, 3, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Tickets + Resales | User growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <ChartCard title="Ticket Sales & Resales">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="ticketsSold" name="Tickets Sold" fill="#026CDF" radius={[3, 3, 0, 0]} />
              <Bar dataKey="resales" name="Resales" fill="#FF6B00" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="User Growth">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 4: New vs Recurring subscribers */}
      <ChartCard title="New vs Recurring Buyers">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="newSubscribers" name="New Buyers" fill="#10b981" radius={[3, 3, 0, 0]} stackId="b" />
            <Bar dataKey="recurringSubscribers" name="Repeat Buyers" fill="#026CDF" radius={[3, 3, 0, 0]} stackId="b" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
