"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Users, Bed, Clock, ArrowLeft, CheckCircle2, Clock3, Plus, Minus, DollarSign, CalendarCheck } from "lucide-react";
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

interface Appointment {
  id: string | number;
  patientName: string;
  time: string;
  status: string;
  reason: string;
}

export function DoctorDashboard({ onNavigate }: DoctorDashboardProps) {
  const router = useRouter();
  const [availableBeds, setAvailableBeds] = useState(12);
  const [doctorName, setDoctorName] = useState("Verma");
  const [specialty, setSpecialty] = useState("General Medicine");
  const [isAvailable, setIsAvailable] = useState(true);

  // Parse localStorage state on mount
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

  // TRUE TABLE INTERACTIVITY: Initialize with realistic mock data using useState
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, patientName: "John Doe", time: "09:00 AM", status: "Pending", reason: "Routine Checkup" },
    { id: 2, patientName: "Jane Smith", time: "10:30 AM", status: "Confirmed", reason: "Follow-up Consultation" },
    { id: 3, patientName: "Rahul Sharma", time: "11:45 AM", status: "Pending", reason: "Blood Test Review" },
    { id: 4, patientName: "Emily Chen", time: "02:00 PM", status: "Completed", reason: "Vaccination" }
  ]);

  const updateBeds = (increment: number) => {
    setAvailableBeds((prev) => Math.max(0, prev + increment));
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

  const updateAppointmentStatus = (identifier: string | number, newStatus: string) => {
    setAppointments(appointments.map(app => 
      app.id === identifier ? { ...app, status: newStatus } : app
    ));
  };

  const displayDoctorName = doctorName.startsWith("Dr") ? doctorName : `Dr. ${doctorName}`;

  return (
    <div className="min-h-[100vh] bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8">
      {/* Top Level Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        
        {/* ================= SIDEBAR COLUMN (Left) ================= */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Role Toggle */}
          <Button 
            className="w-full justify-start gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 shadow-sm h-12 rounded-xl"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 text-slate-600" />
              Switch to Patient View
            </Link>
          </Button>

          {/* Profile Quick Edit Settings */}
          <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden p-5">
            <CardHeader className="pb-3 border-b border-slate-100 px-0 pt-0">
              <CardTitle className="text-slate-900 font-bold text-base">Profile Quick Edit</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-5 pb-0 space-y-5">
              <div className="space-y-2">
                <label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Display Name</label>
                <input 
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm text-slate-900"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Specialization</label>
                <select 
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm appearance-none text-slate-900"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.75rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Availability</label>
                <button 
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all font-medium text-sm ${isAvailable ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
                >
                  {isAvailable ? (
                    <>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      Available Today
                    </>
                  ) : (
                    <>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                      On Leave
                    </>
                  )}
                </button>
              </div>
              <Button onClick={saveSettings} className="w-full rounded-xl shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white border-0 mt-2">
                Save Settings
              </Button>
            </CardContent>
          </Card>

          {/* Earnings & Schedule */}
          <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden p-5">
            <CardHeader className="pb-3 border-b border-slate-100 px-0 pt-0">
              <CardTitle className="text-slate-900 font-bold text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                Earnings & Agenda
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-5 pb-0 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-slate-500 text-xs mb-1">Total Monthly Earnings</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">₹48,500</p>
              </div>
              
              <div>
                <h4 className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
                  <CalendarCheck className="h-3.5 w-3.5" /> Today's Schedule
                </h4>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="font-medium text-slate-800">Morning Ward Rounds</p>
                      <p className="text-slate-500 text-xs">08:00 AM - 10:00 AM</p>
                    </div>
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="font-medium text-slate-800">OPD Consultations</p>
                      <p className="text-slate-500 text-xs">10:30 AM - 01:00 PM</p>
                    </div>
                  </li>
                  <li className="flex gap-3 text-sm opacity-50">
                    <span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="font-medium text-slate-800">Lunch Break</p>
                      <p className="text-slate-500 text-xs">01:00 PM - 02:00 PM</p>
                    </div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* ================= MAIN DASHBOARD CONTENT (Right) ================= */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Header */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden">
            <h1 className="text-slate-900 font-bold text-3xl tracking-tight relative z-10">
              Welcome, {displayDoctorName}
            </h1>
            <p className="text-slate-500 mt-2 relative z-10">
              Here's your schedule and overview for today.
            </p>
          </div>

          {/* Stat Cards Row */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden p-5 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-0 pt-0">
                <CardTitle className="text-slate-500 text-xs font-semibold uppercase">Total Appointments</CardTitle>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="text-3xl font-bold text-slate-900">{appointments.length}</div>
                <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                  <span className="text-emerald-600">+2</span> from yesterday
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden p-5 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-0 pt-0">
                <CardTitle className="text-slate-500 text-xs font-semibold uppercase">Today's Patients</CardTitle>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="text-3xl font-bold text-slate-900">
                  {appointments.filter(a => a.status !== "Completed").length}
                </div>
                <p className="text-slate-500 text-xs mt-1">
                  Awaiting consultation
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden p-5 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-0 pt-0">
                <CardTitle className="text-slate-500 text-xs font-semibold uppercase">Available Beds</CardTitle>
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <Bed className="h-4 w-4 text-emerald-500" />
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-slate-900">{availableBeds}</div>
                  <div className="flex gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-900" onClick={() => updateBeds(-1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-900" onClick={() => updateBeds(1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-slate-500 text-xs mt-1">In your department</p>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Appointments Table */}
          <Card className="bg-white border border-slate-200 shadow-sm flex-1 rounded-2xl overflow-hidden flex flex-col p-5">
            <CardHeader className="border-b border-slate-100 px-0 pt-0 pb-4">
              <CardTitle className="text-slate-900 font-bold text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-500" />
                Interactive Appointments Table
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto mt-4">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="font-semibold text-slate-600">Patient Name</TableHead>
                    <TableHead className="font-semibold text-slate-600">Time Slot</TableHead>
                    <TableHead className="font-semibold text-slate-600">Reason</TableHead>
                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600 pr-6">Action Controls</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.length === 0 ? (
                    <TableRow className="border-slate-100 hover:bg-slate-50/50">
                      <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                        No appointments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointments.map((appointment) => {
                      const appId = appointment.id;
                      
                      // Status badge styling
                      let badgeClasses = "bg-slate-100 text-slate-600 border-slate-200";
                      if (appointment.status === "Pending") badgeClasses = "bg-amber-100 text-amber-700 border-amber-200";
                      if (appointment.status === "Accepted" || appointment.status === "Confirmed") badgeClasses = "bg-emerald-100 text-emerald-700 border-emerald-200";
                      if (appointment.status === "Completed") badgeClasses = "bg-slate-100 text-slate-500 border-slate-200";

                      return (
                        <TableRow key={appId} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-medium text-slate-800">{appointment.patientName}</TableCell>
                          <TableCell className="text-slate-500">
                            <div className="flex items-center gap-1.5 text-sm">
                              <Clock3 className="h-3.5 w-3.5" />
                              {appointment.time}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-500">
                            {appointment.reason}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`font-medium ${badgeClasses}`}>
                              {appointment.status === "Completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {appointment.status !== "Completed" && <Activity className="h-3 w-3 mr-1" />}
                              {appointment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-2">
                              {appointment.status !== "Completed" && (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                                    onClick={() => updateAppointmentStatus(appId, "Accepted")}
                                    disabled={appointment.status === "Accepted" || appointment.status === "Confirmed"}
                                  >
                                    Accept
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 border-slate-300 text-slate-700 hover:bg-slate-100"
                                    onClick={() => updateAppointmentStatus(appId, "Completed")}
                                  >
                                    Complete
                                  </Button>
                                </>
                              )}
                              {appointment.status === "Completed" && (
                                <span className="text-xs text-slate-500 font-medium px-3 py-1.5 bg-slate-100 rounded-md border border-slate-200">
                                  Done
                                </span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
