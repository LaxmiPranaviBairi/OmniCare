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

  useEffect(() => {
    // Fetch the hospital details when component mounts
    const fetchHospital = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hospitals');
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
      await fetch(`http://localhost:5000/api/hospitals/${hospitalId}/beds`, {
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
        const response = await fetch('http://localhost:5000/api/appointments');
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
      await fetch(`http://localhost:5000/api/appointments/${identifier}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update status in backend:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      {/* Header section with Role Switcher */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Doctor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Dr. Smith. Here's your schedule for today.</p>
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
            <div className="text-2xl font-bold text-primary">24</div>
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
            <div className="text-2xl font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground mt-1">8 remaining</p>
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
