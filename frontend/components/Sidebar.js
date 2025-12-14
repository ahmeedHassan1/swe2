"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  Banknote,
  LogOut,
  Megaphone
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    ...(isAdmin
      ? [
          {
            label: "Employees",
            icon: Users,
            href: "/dashboard/employees",
            active: pathname === "/dashboard/employees",
          },
        ]
      : []),
    {
      label: isAdmin ? "Daily Attendance" : "My Attendance",
      icon: Clock,
      href: "/dashboard/attendance",
      active: pathname === "/dashboard/attendance",
    },
    {
      label: isAdmin ? "Leave Requests" : "My Leaves",
      icon: Calendar,
      href: "/dashboard/leaves",
      active: pathname === "/dashboard/leaves",
    },
    {
      label: "Payroll",
      icon: Banknote,
      href: "/dashboard/payroll",
      active: pathname === "/dashboard/payroll",
    },
    {
      label: "Announcements",
      icon: Megaphone,
      href: "/dashboard/announcements",
      active: pathname === "/dashboard/announcements",
    },
    ...(isAdmin
        ? []
        : [])
  ];

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-muted/20 border-r border-border/50 text-foreground">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                Nexus<span className="text-foreground">HR</span>
            </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                route.active ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.active ? "text-primary" : "text-muted-foreground")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
         <div 
            onClick={logout}
            className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-destructive hover:bg-destructive/10 rounded-lg transition text-muted-foreground"
         >
              <div className="flex items-center flex-1">
                <LogOut className="h-5 w-5 mr-3 text-muted-foreground group-hover:text-destructive" />
                Logout
              </div>
         </div>
      </div>
    </div>
  );
}
