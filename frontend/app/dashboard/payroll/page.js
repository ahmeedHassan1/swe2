"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchWithAuth } from "@/lib/api";
import { Input } from "@/components/ui/input";

export default function PayrollPage() {
  const { user } = useAuth();
  if (user?.role === "ADMIN") {
    return <AdminPayroll />;
  }
  return <EmployeePayroll user={user} />;
}

function AdminPayroll() {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [records, setRecords] = useState([]);
    
    const fetchPayroll = async () => {
        const res = await fetchWithAuth(`/payroll/period?month=${month}&year=${year}`);
        if(res.ok) setRecords(await res.json());
    };

    const processPayroll = async () => {
        try {
            // Fetch all employees first
            const empRes = await fetchWithAuth("/employees").then(r => r.json());
            const employees = empRes.content || [];
            
            let successCount = 0;
            let skipCount = 0;
            let errorCount = 0;
            const errors = [];
            
            // Process payroll for each employee
            for (const emp of employees) {
                try {
                    const res = await fetchWithAuth("/payroll", {
                        method: 'POST',
                        body: JSON.stringify({ 
                            employeeId: emp.id,
                            month: parseInt(month),
                            year: parseInt(year),
                            baseSalary: emp.salary,
                            bonuses: 0,
                            deductions: 0
                        })
                    });
                    
                    if (res.ok) {
                        successCount++;
                    } else {
                        const errorText = await res.text();
                        if (errorText.includes("already processed")) {
                            skipCount++;
                        } else {
                            errorCount++;
                            errors.push(`${emp.firstName} ${emp.lastName}: ${errorText}`);
                        }
                    }
                } catch (err) {
                    errorCount++;
                    errors.push(`${emp.firstName} ${emp.lastName}: ${err.message}`);
                }
            }
            
            // Show summary
            let message = `Payroll Processing Complete:\n`;
            message += `✓ Processed: ${successCount}\n`;
            if (skipCount > 0) message += `⊘ Already processed: ${skipCount}\n`;
            if (errorCount > 0) {
                message += `✗ Errors: ${errorCount}\n\n`;
                message += errors.join('\n');
            }
            
            alert(message);
            fetchPayroll();
        } catch (error) {
            console.error("Failed to process payroll:", error);
            alert(`Failed to process payroll: ${error.message}`);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Payroll Management</h1>
            <div className="flex gap-4 items-end">
                <div>
                    <label>Month</label>
                    <Input type="number" value={month} onChange={(e) => setMonth(e.target.value)} />
                </div>
                <div>
                    <label>Year</label>
                    <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <Button onClick={processPayroll}>Process Payroll</Button>
                <Button variant="outline" onClick={fetchPayroll}>View</Button>
            </div>
            
             <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee ID</TableHead>
                                <TableHead>Base</TableHead>
                                <TableHead>Net</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.map(r => (
                                <TableRow key={r.id}>
                                    <TableCell>{r.employeeId}</TableCell>
                                    <TableCell>{r.baseSalary}</TableCell>
                                    <TableCell>{r.netSalary}</TableCell>
                                    <TableCell>{r.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function EmployeePayroll({ user }) {
    const [slips, setSlips] = useState([]);

    useEffect(() => {
        const fetchMy = async () => {
             const id = user.employeeTableId || user.id;
             const res = await fetchWithAuth(`/payroll/employee/${id}`);
             if(res.ok) {
                 const data = await res.json();
                 setSlips(Array.isArray(data) ? data : [data]);
             }
        };
        fetchMy();
    }, [user]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Pay Slips</h1>
             <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Period</TableHead>
                                <TableHead>Base</TableHead>
                                <TableHead>Bonus</TableHead>
                                <TableHead>Deductions</TableHead>
                                <TableHead>Net</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {slips.map(s => (
                                <TableRow key={s.id}>
                                    <TableCell>{s.month}/{s.year}</TableCell>
                                    <TableCell>{s.baseSalary}</TableCell>
                                    <TableCell className="text-green-600">+{s.bonuses}</TableCell>
                                    <TableCell className="text-red-600">-{s.deductions}</TableCell>
                                    <TableCell className="font-bold">{s.netSalary}</TableCell>
                                    <TableCell>{s.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
