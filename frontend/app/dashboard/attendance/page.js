"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchWithAuth } from "@/lib/api";
import { Loader2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AttendancePage() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <AdminAttendance />;
  }
  return <EmployeeAttendance user={user} />;
}

function AdminAttendance() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchDaily();
    }, [date]);

    const fetchDaily = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`/attendance/daily?date=${date}`);
            if (res.ok) {
                const data = await res.json();
                setAttendance(data);
            }
        } catch(e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Daily Attendance</h1>
                <input 
                    type="date" 
                    className="border rounded p-2 bg-background" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                />
            </div>
             <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Clock In</TableHead>
                        <TableHead>Clock Out</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow> : 
                        attendance.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center">No records found.</TableCell></TableRow> :
                        attendance.map(a => (
                            <TableRow key={a.id}>
                                <TableCell>{a.employeeId}</TableCell>
                                <TableCell>{a.clockInTime ? new Date(a.clockInTime).toLocaleTimeString() : '-'}</TableCell>
                                <TableCell>{a.clockOutTime ? new Date(a.clockOutTime).toLocaleTimeString() : '-'}</TableCell>
                                <TableCell><Badge>{a.status}</Badge></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function EmployeeAttendance({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clocking, setClocking] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
        // Use employeeTableId if available, else fallback but backend needs Long ID
        const id = user.employeeTableId || user.id; 
        const res = await fetchWithAuth(`/attendance/employee/${id}`);
        if (res.ok) setHistory(await res.json());
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleClock = async (endpoint) => {
      setClocking(true);
      try {
          const res = await fetchWithAuth(`/attendance/${endpoint}`, {
              method: 'POST',
              body: JSON.stringify({ employeeId: user.employeeTableId || user.id })
          });
          if (res.ok) fetchHistory();
          else alert("Failed: " + await res.text());
      } catch(e) { alert(e.message); }
      finally { setClocking(false); }
  };

  const lastEntry = history.length > 0 ? history.sort((a,b) => new Date(b.date) - new Date(a.date))[0] : null;
  const isClockedIn = lastEntry?.clockInTime && !lastEntry?.clockOutTime;

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">My Attendance</h1>
             <Button 
                onClick={() => handleClock(isClockedIn ? 'clock-out' : 'clock-in')}
                disabled={clocking}
                variant={isClockedIn ? "destructive" : "default"}
             >
                {clocking ? <Loader2 className="animate-spin mr-2" /> : <Clock className="mr-2 h-4 w-4" />}
                {isClockedIn ? "Clock Out" : "Clock In"}
             </Button>
        </div>
        <Card>
            <CardHeader><CardTitle>History</CardTitle></CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>In</TableHead>
                        <TableHead>Out</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow> : 
                         history.map((record) => (
                           <TableRow key={record.id}>
                             <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                             <TableCell>{record.clockInTime ? new Date(record.clockInTime).toLocaleTimeString() : '-'}</TableCell>
                             <TableCell>{record.clockOutTime ? new Date(record.clockOutTime).toLocaleTimeString() : '-'}</TableCell>
                             <TableCell>{record.workHours?.toFixed(2)}</TableCell>
                             <TableCell><Badge>{record.status}</Badge></TableCell>
                           </TableRow>
                         ))}
                    </TableBody>
                 </Table>
            </CardContent>
        </Card>
    </div>
  );
}
