"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarDays, Users, Ticket,
  CreditCard, RefreshCw, ShieldCheck, AlertTriangle,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Tickets", href: "/admin/tickets", icon: Ticket },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Resale", href: "/admin/resale", icon: RefreshCw },
  { label: "Reports", href: "/admin/reports", icon: AlertTriangle },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "flex flex-col bg-gray-900 text-white flex-shrink-0 transition-all duration-300 overflow-hidden",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-14 border-b border-gray-700 flex-shrink-0 transition-all duration-300",
        collapsed ? "justify-center px-0" : "gap-3 px-5"
      )}>
        <div className="bg-blue-600 p-1.5 rounded-lg flex-shrink-0">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0 overflow-hidden">
            <p className="font-bold text-sm leading-tight truncate">Admin Panel</p>
            <p className="text-xs text-gray-400 truncate">Platform Management</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                collapsed ? "justify-center" : "",
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-gray-700 p-2">
        <button
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-xs font-medium",
            collapsed ? "justify-center" : ""
          )}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
}
