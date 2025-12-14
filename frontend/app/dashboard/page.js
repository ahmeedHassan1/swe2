"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Calendar, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <AdminDashboard user={user} />;
  }
  return <EmployeeDashboard user={user} />;
}

function AdminDashboard({ user }) {
  const [stats, setStats] = useState({ employees: "--", pendingLeaves: "--" });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [empRes, leavesRes] = await Promise.all([
          fetchWithAuth("/employees").then(r => r.json()),
          fetchWithAuth("/leaves/status/PENDING").then(r => r.json())
        ]);

        setStats({
          employees: empRes.totalElements || empRes.content?.length || 0,
          pendingLeaves: Array.isArray(leavesRes) ? leavesRes.length : 0
        });
      } catch (error) {
        console.error("Failed to fetch admin dashboard stats:", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
         <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
         <p className="text-muted-foreground">Welcome back, {user?.name}. Here's an overview of your organization.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employees}</div>
            <p className="text-xs text-muted-foreground">Active in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingLeaves}</div>
            <p className="text-xs text-muted-foreground">Requires approval</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmployeeDashboard({ user }) {
  const [stats, setStats] = useState({ hours: "--", usedLeaves: "--" });

  useEffect(() => {
    async function fetchStats() {
       const id = user.employeeTableId || user.id;
       if (!id) return;

       try {
        const [attendanceRes, leavesRes] = await Promise.all([
          fetchWithAuth(`/attendance/employee/${id}`).then(r => r.json()),
          fetchWithAuth(`/leaves/employee/${id}`).then(r => r.json())
        ]);

        // Calculate hours for the past 7 days (current week)
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 6); // Go back 6 days to get 7 days total (including today)
        startOfWeek.setHours(0, 0, 0, 0);

        const attendanceArray = Array.isArray(attendanceRes) ? attendanceRes : [];
        
        const thisWeekRecords = attendanceArray.filter(a => {
          if (!a.date) return false;
          const attendanceDate = new Date(a.date);
          return attendanceDate >= startOfWeek;
        });

        const hoursThisWeek = thisWeekRecords.reduce((acc, curr) => {
          const hours = parseFloat(curr.workHours) || 0;
          return acc + hours;
        }, 0);

        // Count used leaves (APPROVED)
        const leavesArray = Array.isArray(leavesRes) ? leavesRes : [];
        const usedLeavesCount = leavesArray.filter(l => l.status === "APPROVED").length;

        setStats({
          hours: hoursThisWeek.toFixed(1),
          usedLeaves: usedLeavesCount
        });

       } catch (error) {
         console.error("Failed to fetch employee stats:", error);
       }
    }
    fetchStats();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
         <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
         <p className="text-muted-foreground">Welcome back, {user?.name}.</p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hours}</div>
            <p className="text-xs text-muted-foreground">Hours this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used Leaves</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usedLeaves}</div>
            <p className="text-xs text-muted-foreground">Approved leaves</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
