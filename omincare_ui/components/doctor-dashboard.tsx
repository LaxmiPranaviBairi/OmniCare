"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Users, Bed, Clock, ArrowLeft, CheckCircle2, Clock3, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DoctorDashboardProps {
  onNavigate: (page: string) => void;
}

export function DoctorDashboard({ onNavigate }: DoctorDashboardProps) {
  const router = useRouter();
  const [availableBeds, setAvailableBeds] = useState(4);
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState("Verma");
  const [specialty, setSpecialty] = useState("General Medicine");
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('omnicare_user') || localStorage.getItem('user');
    let defaultName = "Verma";
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.name) defaultName = user.name;
      } catch (e) {}
    }
    const savedName = localStorage.getItem('doctor_name');
    setDoctorName(savedName || defaultName);

    const savedSpecialty = localStorage.getItem('doctor_specialty');
    if (savedSpecialty) {
      setSpecialty(savedSpecialty);
    }
    const savedAvailability = localStorage.getItem('doctor_availability');
    if (savedAvailability !== null) {
      setIsAvailable(savedAvailability === 'true');
    }
  }, []);

  useEffect(() => {
    // Fetch the hospital details when component mounts
    const fetchHospital = async () => {
      try {
        const response = await fetch('https://omnicare-6244.onrender.com/api/hospitals');
        const data = await response.json();
        if (data && data.length > 0) {
          // Use the first hospital for this doctor's dashboard
          setHospitalId(data[0]._id);
          if (data[0].availableBeds !== undefined) {
            setAvailableBeds(data[0].availableBeds);
          }
        }
      } catch (err) {
        console.error("Failed to fetch hospital data:", err);
      }
    };
    fetchHospital();
  }, []);

  const updateBeds = async (newCount: number) => {
    if (newCount < 0) return;
    setAvailableBeds(newCount); // optimistic update
    
    if (!hospitalId) return;
    try {
      await fetch(`https://omnicare-6244.onrender.com/api/hospitals/${hospitalId}/beds`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beds: newCount }),
      });
    } catch (err) {
      console.error("Failed to update beds in backend:", err);
    }
  };

  interface Appointment {
    _id?: string;
    id?: string | number;
    patientName: string;
    hospital: string;
    time: string;
    status: string;
  }
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('https://omnicare-6244.onrender.com/api/appointments');
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };
    fetchAppointments();
  }, []);

  const toggleAppointmentStatus = async (identifier: string | number) => {
    const appointment = appointments.find(app => (app._id || app.id) === identifier);
    if (!appointment) return;
    
    const newStatus = appointment.status === "Pending" ? "Completed" : "Pending";
    
    setAppointments(appointments.map(app => 
      (app._id || app.id) === identifier ? { ...app, status: newStatus } : app
    ));

    try {
      await fetch(`https://omnicare-6244.onrender.com/api/appointments/${identifier}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update status in backend:", err);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('doctor_name', doctorName);
    localStorage.setItem('doctor_specialty', specialty);
    localStorage.setItem('doctor_availability', isAvailable.toString());

    try {
      const userStr = localStorage.getItem('omnicare_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.name = doctorName;
        localStorage.setItem('omnicare_user', JSON.stringify(user));
      }
      const genericUserStr = localStorage.getItem('user');
      if (genericUserStr) {
        const user = JSON.parse(genericUserStr);
        user.name = doctorName;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (e) {}

    alert("Profile updated successfully!");
  };

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      {/* Header section with Role Switcher */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Doctor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome, {doctorName.startsWith("Dr") ? doctorName : `Dr. ${doctorName}`}. Here's your schedule for today.</p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-primary/20 hover:bg-primary/5 text-primary"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Switch to Patient View
          </Link>
        </Button>
      </header>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/10 shadow-sm bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Appointments
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{appointments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+2 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card className="border-primary/10 shadow-sm bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Patients
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{appointments.filter(a => a.status !== "Completed").length}</div>
            <p className="text-xs text-muted-foreground mt-1">{appointments.filter(a => a.status !== "Completed").length} remaining</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10 shadow-sm bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Beds
            </CardTitle>
            <Bed className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-primary">{availableBeds}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateBeds(availableBeds - 1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateBeds(availableBeds + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">In your department</p>
          </CardContent>
        </Card>
      </div>

      {/* Account & Practice Settings */}
      <Card className="border-primary/10 shadow-sm bg-card">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-lg">Account & Practice Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Doctor Name</label>
              <input 
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                placeholder="Your Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Medical Specialization</label>
              <select 
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
              >
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Availability Status</label>
              <button 
                onClick={() => setIsAvailable(!isAvailable)}
                className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border transition-all font-medium ${isAvailable ? 'border-green-200 bg-green-500/10 text-green-600 hover:bg-green-500/20' : 'border-red-200 bg-red-500/10 text-red-600 hover:bg-red-500/20'}`}
              >
                {isAvailable ? (
                  <>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Available Today
                  </>
                ) : (
                  <>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    On Leave
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={saveSettings} className="px-6 rounded-xl shadow-sm">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="border-primary/10 shadow-sm flex-1">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow>
                <TableHead className="font-semibold text-primary">Patient Name</TableHead>
                <TableHead className="font-semibold text-primary">Time</TableHead>
                <TableHead className="text-right font-semibold text-primary">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment, index) => (
                <TableRow key={appointment._id || index} className="hover:bg-primary/5 transition-colors">
                  <TableCell className="font-medium">{appointment.patientName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" />
                      {appointment.time}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant="secondary"
                      className={
                        "cursor-pointer " + (appointment.status === "Completed" 
                          ? "bg-green-100 text-green-700 hover:bg-green-100/80 gap-1"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-100/80 gap-1")
                      }
                      onClick={() => toggleAppointmentStatus(appointment._id || appointment.id || index)}
                    >
                      {appointment.status === "Completed" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {appointment.status}
                    </Badge>
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
