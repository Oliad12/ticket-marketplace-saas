"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import StatCard from "@/components/admin/StatCard";
import {
  DollarSign, Users, UserCheck, Ticket,
  TicketCheck, TrendingUp, CalendarDays, RefreshCw, Clock,
} from "lucide-react";
import Spinner from "@/components/Spinner";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export default function AdminOverviewPage() {
  const stats = useQuery(api.admin.getAnalytics);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1 text-sm">Real-time platform metrics</p>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-5">
        <StatCard label="Total Sales" value={`ETB ${fmt(stats.totalRevenue)}`} icon={DollarSign} sub={`ETB ${fmt(stats.revenueToday)} today`} color="green" />
        <StatCard label="Customers Today" value={stats.customersToday} icon={Users} sub="Unique buyers today" color="blue" />
        <StatCard label="Repeat Customers" value={stats.repeatCustomers} icon={UserCheck} sub="Bought more than once" color="purple" />
        <StatCard label="Tickets Sold" value={stats.totalTicketsSold} icon={TrendingUp} sub="Valid + used" color="orange" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-5">
        <StatCard label="Active Tickets" value={stats.activeTickets} icon={TicketCheck} sub="Currently valid" color="teal" />
        <StatCard label="Available Tickets" value={stats.availableTickets} icon={Ticket} sub="Unsold across events" color="blue" />
        <StatCard label="Active Resale" value={stats.activeResale} icon={RefreshCw} sub="Listed for resale" color="orange" className="col-span-2 lg:col-span-1" />
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} sub="Registered accounts" color="purple" />
        <StatCard label="Active Events" value={stats.totalEvents} icon={CalendarDays} sub="Non-cancelled" color="green" />
        <StatCard label="Waitlist" value={stats.waitlistCount} icon={Clock} sub="Waiting or offered" color="red" className="col-span-2 lg:col-span-1" />
      </div>
    </div>
  );
}
