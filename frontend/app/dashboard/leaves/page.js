"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchWithAuth } from "@/lib/api";
import { Loader2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LeavesPage() {
  const { user } = useAuth();
  if (user?.role === "ADMIN") {
    return <AdminLeaves />;
  }
  return <EmployeeLeaves user={user} />;
}

function AdminLeaves() {
    const [leaves, setLeaves] = useState([]);
    
    useEffect(() => {
        const fetchLeaves = async () => {
            const res = await fetchWithAuth("/leaves"); // Default gets all? Or /leaves/status/PENDING
            if(res.ok) setLeaves(await res.json());
        };
        fetchLeaves();
    }, []);

    const updateStatus = async (id, status) => {
        await fetchWithAuth(`/leaves/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        window.location.reload(); 
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Leave Requests</h1>
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaves.map(l => (
                                <TableRow key={l.id}>
                                    <TableCell>{l.employeeId}</TableCell>
                                    <TableCell>{l.type}</TableCell>
                                    <TableCell>{l.reason}</TableCell>
                                    <TableCell>{l.startDate} - {l.endDate}</TableCell>
                                    <TableCell><Badge>{l.status}</Badge></TableCell>
                                    <TableCell>
                                        {l.status === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => updateStatus(l.id, 'APPROVED')}>Approve</Button>
                                                <Button size="sm" variant="destructive" onClick={() => updateStatus(l.id, 'REJECTED')}>Reject</Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function EmployeeLeaves({ user }) {
    const [leaves, setLeaves] = useState([]);
    
    useEffect(() => {
        const fetchMy = async () => {
             const id = user.employeeTableId || user.id;
             const res = await fetchWithAuth(`/leaves/employee/${id}`);
             if(res.ok) setLeaves(await res.json());
        };
        fetchMy();
    }, [user]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Leaves</h1>
                <Link href="/dashboard/leaves/new">
                    <Button><Plus className="mr-2 h-4 w-4" /> New Request</Button>
                </Link>
            </div>
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaves.map(l => (
                                <TableRow key={l.id}>
                                    <TableCell>{l.type}</TableCell>
                                    <TableCell>{l.startDate} to {l.endDate}</TableCell>
                                    <TableCell>{l.reason}</TableCell>
                                    <TableCell><Badge>{l.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
