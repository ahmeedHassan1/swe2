"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchWithAuth } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function NewLeaveRequestPage() {
	const router = useRouter();
	const { user } = useAuth();
	const [formData, setFormData] = useState({
		type: "ANNUAL_LEAVE",
		startDate: "",
		endDate: "",
		reason: ""
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const employeeId = user.employeeTableId || user.id;
			const res = await fetchWithAuth("/leaves", {
				method: "POST",
				body: JSON.stringify({
					employeeId,
					...formData
				})
			});

			if (res.ok) {
				alert("Leave request submitted successfully!");
				router.push("/dashboard/leaves");
			} else {
				alert("Failed to submit leave request");
			}
		} catch (error) {
			console.error("Error submitting leave request:", error);
			alert("An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div>
				<h1 className="text-3xl font-bold">New Leave Request</h1>
				<p className="text-muted-foreground">Submit a new leave request</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Leave Details</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<Label htmlFor="type">Leave Type</Label>
							<select
								id="type"
								value={formData.type}
								onChange={(e) =>
									setFormData({ ...formData, type: e.target.value })
								}
								className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground"
								required>
								<option value="ANNUAL_LEAVE">Annual Leave</option>
								<option value="SICK_LEAVE">Sick Leave</option>
								<option value="CASUAL_LEAVE">Casual Leave</option>
								<option value="EMERGENCY_LEAVE">Emergency Leave</option>
								<option value="UNPAID_LEAVE">Unpaid Leave</option>
							</select>
						</div>

						<div>
							<Label htmlFor="startDate">Start Date</Label>
							<Input
								id="startDate"
								type="date"
								value={formData.startDate}
								onChange={(e) =>
									setFormData({ ...formData, startDate: e.target.value })
								}
								required
							/>
						</div>

						<div>
							<Label htmlFor="endDate">End Date</Label>
							<Input
								id="endDate"
								type="date"
								value={formData.endDate}
								onChange={(e) =>
									setFormData({ ...formData, endDate: e.target.value })
								}
								min={formData.startDate}
								required
							/>
						</div>

						<div>
							<Label htmlFor="reason">Reason</Label>
							<textarea
								id="reason"
								value={formData.reason}
								onChange={(e) =>
									setFormData({ ...formData, reason: e.target.value })
								}
								className="w-full mt-1 px-3 py-2 border rounded-md"
								rows={4}
								required
							/>
						</div>

						<div className="flex gap-2">
							<Button type="submit" disabled={loading}>
								{loading ? "Submitting..." : "Submit Request"}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => router.push("/dashboard/leaves")}>
								Cancel
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
