"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarDays, Users, Ticket,
  CreditCard, RefreshCw, ShieldCheck, AlertTriangle,
  ChevronLeft, ChevronRight, X,
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

function NavLinks({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  return (
    <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
      {navItems.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
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
  );
}

export default function AdminSidebar() {
  const { collapsed, toggle, mobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {/* ── MOBILE DRAWER ── */}
      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[55] bg-black/50"
          onClick={closeMobile}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full z-[60] w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">Admin Panel</span>
          </div>
          <button
            onClick={closeMobile}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <NavLinks onClose={closeMobile} />

        <div className="border-t border-gray-700 px-5 py-3">
          <p className="text-xs text-gray-500">Ticketr Platform</p>
        </div>
      </aside>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-gray-900 text-white flex-shrink-0 transition-all duration-300 overflow-hidden",
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

        <NavLinks />

        {/* Collapse toggle */}
        <div className="border-t border-gray-700 p-2">
          <button
            onClick={toggle}
            title={collapsed ? "Expand" : "Collapse"}
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
    </>
  );
}
