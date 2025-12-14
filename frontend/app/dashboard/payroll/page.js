"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchWithAuth } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Check } from "lucide-react";

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
    const [showProcessDialog, setShowProcessDialog] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [payrollData, setPayrollData] = useState({});
    const [applyTax, setApplyTax] = useState(false);
    
    const fetchPayroll = async () => {
        const res = await fetchWithAuth(`/payroll/period?month=${month}&year=${year}`);
        if(res.ok) setRecords(await res.json());
    };

    const openProcessDialog = async () => {
        // Fetch all employees
        const empRes = await fetchWithAuth("/employees").then(r => r.json());
        const emps = empRes.content || [];
        setEmployees(emps);
        
        // Initialize payroll data with default values
        const initialData = {};
        emps.forEach(emp => {
            initialData[emp.id] = {
                baseSalary: emp.salary,
                bonuses: 0,
                deductions: applyTax ? (emp.salary * 0.10) : 0
            };
        });
        setPayrollData(initialData);
        setShowProcessDialog(true);
    };

    const updatePayrollField = (empId, field, value) => {
        setPayrollData(prev => ({
            ...prev,
            [empId]: {
                ...prev[empId],
                [field]: parseFloat(value) || 0
            }
        }));
    };

    const toggleTax = () => {
        const newApplyTax = !applyTax;
        setApplyTax(newApplyTax);
        
        // Update deductions for all employees
        const updated = {};
        employees.forEach(emp => {
            updated[emp.id] = {
                ...payrollData[emp.id],
                deductions: newApplyTax ? (emp.salary * 0.10) : 0
            };
        });
        setPayrollData(updated);
    };

    const processPayroll = async () => {
        try {
            let successCount = 0;
            let skipCount = 0;
            let errorCount = 0;
            const errors = [];
            
            for (const emp of employees) {
                const data = payrollData[emp.id];
                try {
                    const res = await fetchWithAuth("/payroll", {
                        method: 'POST',
                        body: JSON.stringify({ 
                            employeeId: emp.id,
                            month: parseInt(month),
                            year: parseInt(year),
                            baseSalary: data.baseSalary,
                            bonuses: data.bonuses,
                            deductions: data.deductions
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
            
            let message = `Payroll Processing Complete:\n`;
            message += `✓ Processed: ${successCount}\n`;
            if (skipCount > 0) message += `⊘ Already processed: ${skipCount}\n`;
            if (errorCount > 0) {
                message += `✗ Errors: ${errorCount}\n\n`;
                message += errors.join('\n');
            }
            
            alert(message);
            setShowProcessDialog(false);
            fetchPayroll();
        } catch (error) {
            console.error("Failed to process payroll:", error);
            alert(`Failed to process payroll: ${error.message}`);
        }
    };

    const markAsPaid = async (id) => {
        try {
            const res = await fetchWithAuth(`/payroll/${id}/pay`, {
                method: 'PUT'
            });
            
            if (res.ok) {
                alert("Payroll marked as paid successfully!");
                fetchPayroll();
            } else {
                const errorText = await res.text();
                alert(`Failed to mark as paid: ${errorText}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Payroll Management</h1>
            <div className="flex gap-4 items-end">
                <div>
                    <Label>Month</Label>
                    <Input type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} />
                </div>
                <div>
                    <Label>Year</Label>
                    <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <Button onClick={openProcessDialog}><DollarSign className="mr-2 h-4 w-4" />Process Payroll</Button>
                <Button variant="outline" onClick={fetchPayroll}>View</Button>
            </div>
            
            {showProcessDialog && (
                <Card className="border-2 border-primary">
                    <CardHeader>
                        <CardTitle>Process Payroll - {month}/{year}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                            <input 
                                type="checkbox" 
                                id="applyTax" 
                                checked={applyTax}
                                onChange={toggleTax}
                                className="h-4 w-4"
                            />
                            <Label htmlFor="applyTax" className="cursor-pointer">Apply 10% tax deduction</Label>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-96 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Base Salary</TableHead>
                                        <TableHead>Bonuses</TableHead>
                                        <TableHead>Deductions</TableHead>
                                        <TableHead>Net Salary</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employees.map(emp => {
                                        const data = payrollData[emp.id] || {};
                                        const netSalary = (data.baseSalary || 0) + (data.bonuses || 0) - (data.deductions || 0);
                                        return (
                                            <TableRow key={emp.id}>
                                                <TableCell>{emp.firstName} {emp.lastName}</TableCell>
                                                <TableCell>${data.baseSalary}</TableCell>
                                                <TableCell>
                                                    <Input 
                                                        type="number" 
                                                        step="0.01"
                                                        value={data.bonuses}
                                                        onChange={(e) => updatePayrollField(emp.id, 'bonuses', e.target.value)}
                                                        className="w-24"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input 
                                                        type="number" 
                                                        step="0.01"
                                                        value={data.deductions}
                                                        onChange={(e) => updatePayrollField(emp.id, 'deductions', e.target.value)}
                                                        className="w-24"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-bold">${netSalary.toFixed(2)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button onClick={processPayroll}>Confirm & Process</Button>
                            <Button variant="outline" onClick={() => setShowProcessDialog(false)}>Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
            
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee ID</TableHead>
                                <TableHead>Base</TableHead>
                                <TableHead>Bonuses</TableHead>
                                <TableHead>Deductions</TableHead>
                                <TableHead>Net</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.map(r => (
                                <TableRow key={r.id}>
                                    <TableCell>{r.employeeId}</TableCell>
                                    <TableCell>${r.baseSalary}</TableCell>
                                    <TableCell className="text-green-600">+${r.bonuses}</TableCell>
                                    <TableCell className="text-red-600">-${r.deductions}</TableCell>
                                    <TableCell className="font-bold">${r.netSalary}</TableCell>
                                    <TableCell>
                                        <Badge variant={r.status === 'PAID' ? 'default' : 'secondary'}>
                                            {r.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {r.paymentDate ? new Date(r.paymentDate).toLocaleDateString() : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {r.status === 'PENDING' && (
                                            <Button 
                                                size="sm" 
                                                onClick={() => markAsPaid(r.id)}
                                            >
                                                <Check className="mr-1 h-3 w-3" />
                                                Mark Paid
                                            </Button>
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
                                <TableHead>Payment Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {slips.map(s => (
                                <TableRow key={s.id}>
                                    <TableCell>{s.month}/{s.year}</TableCell>
                                    <TableCell>${s.baseSalary}</TableCell>
                                    <TableCell className="text-green-600">+${s.bonuses}</TableCell>
                                    <TableCell className="text-red-600">-${s.deductions}</TableCell>
                                    <TableCell className="font-bold">${s.netSalary}</TableCell>
                                    <TableCell>
                                        <Badge variant={s.status === 'PAID' ? 'default' : 'secondary'}>
                                            {s.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {s.paymentDate ? new Date(s.paymentDate).toLocaleDateString() : '-'}
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
