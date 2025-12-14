"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Plus, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";

export default function AnnouncementsPage() {
	const { user } = useAuth();

	if (user?.role === "ADMIN") {
		return <AdminAnnouncements />;
	}
	return <EmployeeAnnouncements />;
}

function AdminAnnouncements() {
	const [announcements, setAnnouncements] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		content: "",
		priority: "NORMAL"
	});

	useEffect(() => {
		fetchAnnouncements();
	}, []);

	async function fetchAnnouncements() {
		try {
			const res = await fetchWithAuth("/announcements").then((r) => r.json());
			setAnnouncements(Array.isArray(res) ? res : []);
		} catch (error) {
			console.error("Failed to fetch announcements:", error);
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			await fetchWithAuth("/announcements", {
				method: "POST",
				body: JSON.stringify(formData)
			});
			setFormData({ title: "", content: "", priority: "NORMAL" });
			setShowForm(false);
			fetchAnnouncements();
		} catch (error) {
			console.error("Failed to create announcement:", error);
		}
	}

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "URGENT":
				return "text-red-600 bg-red-50 border-red-200";
			case "HIGH":
				return "text-orange-600 bg-orange-50 border-orange-200";
			default:
				return "text-blue-600 bg-blue-50 border-blue-200";
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
					<p className="text-muted-foreground">
						Manage company-wide announcements
					</p>
				</div>
				<Button onClick={() => setShowForm(!showForm)}>
					<Plus className="h-4 w-4 mr-2" />
					New Announcement
				</Button>
			</div>

			{showForm && (
				<Card>
					<CardHeader>
						<CardTitle>Create New Announcement</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="text-sm font-medium">Title</label>
								<input
									type="text"
									required
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									className="w-full mt-1 px-3 py-2 border rounded-md"
								/>
							</div>
							<div>
								<label className="text-sm font-medium">Content</label>
								<textarea
									required
									rows={4}
									value={formData.content}
									onChange={(e) =>
										setFormData({ ...formData, content: e.target.value })
									}
									className="w-full mt-1 px-3 py-2 border rounded-md"
								/>
							</div>
							<div>
								<label className="text-sm font-medium">Priority</label>
								<select
									value={formData.priority}
									onChange={(e) =>
										setFormData({ ...formData, priority: e.target.value })
									}
									className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground">
									<option value="NORMAL">Normal</option>
									<option value="HIGH">High</option>
									<option value="URGENT">Urgent</option>
								</select>
							</div>
							<div className="flex gap-2">
								<Button type="submit">Create Announcement</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => setShowForm(false)}>
									Cancel
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			<div className="space-y-4">
				{loading ? (
					<p className="text-muted-foreground">Loading announcements...</p>
				) : announcements.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
							<p className="text-muted-foreground">No announcements yet</p>
						</CardContent>
					</Card>
				) : (
					announcements.map((announcement) => (
						<Card
							key={announcement.id}
							className={`border-l-4 ${getPriorityColor(
								announcement.priority
							)}`}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<CardTitle className="text-lg">
											{announcement.title}
										</CardTitle>
										<p className="text-sm text-muted-foreground mt-1">
											{new Date(announcement.createdAt).toLocaleDateString()}
										</p>
									</div>
									<span
										className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(
											announcement.priority
										)}`}>
										{announcement.priority}
									</span>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm whitespace-pre-wrap">
									{announcement.content}
								</p>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}

function EmployeeAnnouncements() {
	const [announcements, setAnnouncements] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAnnouncements();
	}, []);

	async function fetchAnnouncements() {
		try {
			const res = await fetchWithAuth("/announcements").then((r) => r.json());
			setAnnouncements(Array.isArray(res) ? res : []);
		} catch (error) {
			console.error("Failed to fetch announcements:", error);
		} finally {
			setLoading(false);
		}
	}

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "URGENT":
				return "text-red-600 bg-red-50 border-red-200";
			case "HIGH":
				return "text-orange-600 bg-orange-50 border-orange-200";
			default:
				return "text-blue-600 bg-blue-50 border-blue-200";
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
				<p className="text-muted-foreground">
					Company announcements and updates
				</p>
			</div>

			<div className="space-y-4">
				{loading ? (
					<p className="text-muted-foreground">Loading announcements...</p>
				) : announcements.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
							<p className="text-muted-foreground">
								No announcements available
							</p>
						</CardContent>
					</Card>
				) : (
					announcements.map((announcement) => (
						<Card
							key={announcement.id}
							className={`border-l-4 ${getPriorityColor(
								announcement.priority
							)}`}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<CardTitle className="text-lg">
											{announcement.title}
										</CardTitle>
										<p className="text-sm text-muted-foreground mt-1">
											{new Date(announcement.createdAt).toLocaleDateString()}
										</p>
									</div>
									<span
										className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(
											announcement.priority
										)}`}>
										{announcement.priority}
									</span>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm whitespace-pre-wrap">
									{announcement.content}
								</p>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
