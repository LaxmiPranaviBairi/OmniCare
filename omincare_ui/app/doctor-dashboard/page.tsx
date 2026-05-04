"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, Clock } from "lucide-react";

interface Appointment {
  _id: string;
  patientName: string;
  date: string;
  time: string;
  status: string;
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("omnicare_user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== "doctor") {
      router.push("/hospital-search");
      return;
    }

    setDoctorName(user.name);
    fetchAppointments(user.name);
  }, [router]);

  const fetchAppointments = async (docName: string) => {
    try {
      console.log('Fetching roster for:', docName);
      const res = await fetch(`https://omnicare-6244.onrender.com/api/appointments/doctor?doctorName=${encodeURIComponent(docName)}`);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err: any) {
      toast.error(err.message || "Error loading appointments");
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (id: string) => {
    try {
      const res = await fetch(`https://omnicare-6244.onrender.com/api/appointments/${id}/complete`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      toast.success("Appointment marked as completed");
      // Refresh the list locally instead of refetching to be snappy
      setAppointments((prev) => 
        prev.map((app) => app._id === id ? { ...app, status: "Completed" } : app)
      );
    } catch (err: any) {
      toast.error(err.message || "Error updating appointment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome, {doctorName}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage your daily appointments and patient roster.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daily Roster</CardTitle>
            <CardDescription>
              Your scheduled appointments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No appointments found.
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment._id || Math.random().toString()}>
                        <TableCell className="font-medium">
                          {appointment.patientName}
                        </TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>
                          {appointment.status.toLowerCase() === "pending" ? (
                            <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          ) : appointment.status.toLowerCase() === "confirmed" ? (
                            <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Confirmed
                            </Badge>
                          ) : appointment.status.toLowerCase() === "completed" ? (
                            <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="secondary">{appointment.status}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {appointment.status.toLowerCase() === "pending" || appointment.status.toLowerCase() === "confirmed" ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => markCompleted(appointment._id)}
                              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              Mark Completed
                            </Button>
                          ) : (
                            <span className="text-sm text-slate-400">Done</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
