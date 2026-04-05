"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import StatCard from "@/components/admin/StatCard";
import {
  DollarSign, Users, UserCheck, Ticket,
  TicketCheck, TrendingUp, CalendarDays, RefreshCw, Clock,
} from "lucide-react";
import Spinner from "@/components/Spinner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

const COLORS = ["#026CDF", "#FF6B00", "#10b981", "#8b5cf6"];

export default function AdminOverviewPage() {
  const stats = useQuery(api.admin.getAnalytics);
  const paymentStats = useQuery(api.admin.getPaymentStats);

  if (!stats || !paymentStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  // Revenue by provider bar chart data
  const revenueData = [
    { name: "Stripe", revenue: paymentStats.stripe.revenue, refunds: paymentStats.stripe.refundTotal },
    { name: "Chapa", revenue: paymentStats.chapa.revenue, refunds: paymentStats.chapa.refundTotal },
  ];

  // Ticket status pie chart data
  const ticketData = [
    { name: "Active", value: stats.activeTickets },
    { name: "Available", value: stats.availableTickets },
    { name: "Resale", value: stats.activeResale },
    { name: "Waitlist", value: stats.waitlistCount },
  ].filter((d) => d.value > 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1 text-sm">Real-time platform metrics</p>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        <StatCard label="Total Sales" value={`ETB ${fmt(stats.totalRevenue)}`} icon={DollarSign} sub={`ETB ${fmt(stats.revenueToday)} today`} color="green" />
        <StatCard label="Customers Today" value={stats.customersToday} icon={Users} sub="Unique buyers today" color="blue" />
        <StatCard label="Repeat Customers" value={stats.repeatCustomers} icon={UserCheck} sub="Bought more than once" color="purple" />
        <StatCard label="Tickets Sold" value={stats.totalTicketsSold} icon={TrendingUp} sub="Valid + used" color="orange" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Active Tickets" value={stats.activeTickets} icon={TicketCheck} sub="Currently valid" color="teal" />
        <StatCard label="Available" value={stats.availableTickets} icon={Ticket} sub="Unsold" color="blue" />
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} sub="Registered" color="purple" />
        <StatCard label="Active Events" value={stats.totalEvents} icon={CalendarDays} sub="Non-cancelled" color="green" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Revenue by Provider — Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue by Payment Provider</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => [`ETB ${fmt(Number(value ?? 0))}`, ""]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue" name="Revenue" fill="#026CDF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="refunds" name="Refunds" fill="#FF6B00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ticket Distribution — Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Ticket Distribution</h3>
          {ticketData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={ticketData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {ticketData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [Number(value ?? 0), ""]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">
              No ticket data yet
            </div>
          )}
        </div>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="Active Resale" value={stats.activeResale} icon={RefreshCw} sub="Listed for resale" color="orange" />
        <StatCard label="Waitlist" value={stats.waitlistCount} icon={Clock} sub="Waiting or offered" color="red" />
        <StatCard label="Total Refunds" value={`ETB ${fmt(paymentStats.totalRefunds)}`} icon={TrendingUp} sub="All time" color="red" className="col-span-2 sm:col-span-1" />
      </div>
    </div>
  );
}
