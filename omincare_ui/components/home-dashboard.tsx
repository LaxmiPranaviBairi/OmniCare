"use client"

import { useState, useEffect } from "react"
import { Search, Hospital, Droplets, Calendar, Stethoscope, Clock, Phone, Mail, Activity } from "lucide-react"

interface HomeDashboardProps {
  onNavigate: (page: string, query?: string) => void
  userName: string
}

export function HomeDashboard({ onNavigate, userName }: HomeDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('https://omnicare-6244.onrender.com/api/appointments');
        const data = await res.json();
        setAppointments(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };
    fetchAppointments();
  }, []);

  // Safe default for the greeting
  const greetingName = userName && userName !== "User" ? userName : "Patient";

  const mockHospitals = [
    { name: "Apollo Hospitals", load: 25, status: "Low", color: "bg-green-500", text: "text-green-600", bg: "bg-green-50" },
    { name: "AIG Hospitals", load: 60, status: "Medium", color: "bg-yellow-500", text: "text-yellow-600", bg: "bg-yellow-50" },
    { name: "KIMS Hospital", load: 90, status: "High", color: "bg-red-500", text: "text-red-600", bg: "bg-red-50" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-primary p-8 md:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Welcome back, {greetingName}
          </h1>
          <p className="text-lg text-white/80 font-medium">
            Your personalized healthcare dashboard. What do you need today?
          </p>
          <form 
            className="relative mt-8 max-w-xl"
            onSubmit={(e) => {
              e.preventDefault();
              onNavigate('doctors', searchQuery);
            }}
          >
            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 focus:outline-none">
              <Search className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for doctors, specialties, or hospitals..."
              className="w-full rounded-2xl py-4 pl-12 pr-4 text-slate-900 bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-white/20 transition-all"
            />
          </form>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
          <Activity className="w-96 h-96" />
        </div>
      </section>

      {/* 2. INTERACTIVE FEATURE CARDS GRID */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Quick Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button 
            onClick={() => onNavigate('doctors')}
            className="group flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 shadow-sm border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer text-center"
          >
            <div className="rounded-2xl bg-blue-50 p-5 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <Stethoscope className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">Find Doctor</h3>
              <p className="text-sm text-slate-500 mt-1">Search top specialists</p>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('hospitals')}
            className="group flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 shadow-sm border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer text-center"
          >
            <div className="rounded-2xl bg-green-50 p-5 text-green-600 group-hover:bg-green-100 transition-colors">
              <Hospital className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">Nearby Hospitals</h3>
              <p className="text-sm text-slate-500 mt-1">Live occupancy tracking</p>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('donors')}
            className="group flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 shadow-sm border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer text-center"
          >
            <div className="rounded-2xl bg-red-50 p-5 text-red-600 group-hover:bg-red-100 transition-colors">
              <Droplets className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">Blood Donors</h3>
              <p className="text-sm text-slate-500 mt-1">Find vital matches</p>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('appointments')}
            className="group flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 shadow-sm border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer text-center"
          >
            <div className="rounded-2xl bg-purple-50 p-5 text-purple-600 group-hover:bg-purple-100 transition-colors">
              <Calendar className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">Book Appointment</h3>
              <p className="text-sm text-slate-500 mt-1">Schedule your visits</p>
            </div>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. LIVE HOSPITAL STATUS SECTION */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Live Hospital Telemetry</h2>
              <button onClick={() => onNavigate('hospitals')} className="text-sm font-semibold text-primary hover:underline">View Map</button>
            </div>
            <div className="space-y-6 flex-1">
              {mockHospitals.map((hospital, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{hospital.name}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${hospital.bg} ${hospital.text}`}>
                      {hospital.status} Load ({hospital.load}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${hospital.color} transition-all duration-1000`} 
                      style={{ width: `${hospital.load}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary animate-pulse" />
                Data is updated in real-time.
              </p>
            </div>
          </section>
        </div>

        {/* 4. UPCOMING APPOINTMENTS SIDE-COLUMN */}
        <div className="lg:col-span-1 space-y-6">
          <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm h-full flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 mb-8">Upcoming Appointments</h2>
            
            <div className="relative border-l-2 border-slate-100 ml-3 pl-6 pb-6 flex-1">
              {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center pt-8">
                  <Calendar className="h-10 w-10 text-slate-200 mb-3" />
                  <p className="text-sm text-slate-500 font-medium">No upcoming appointments scheduled.</p>
                </div>
              ) : (
                appointments.map((appointment, index) => (
                  <div key={appointment._id || index} className={`relative ${index !== appointments.length - 1 ? "mb-8" : ""}`}>
                    <span className={`absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full ${index === 0 ? 'bg-primary' : 'bg-slate-200'} ring-4 ring-white`} />
                    <div className={index === 0 ? "bg-primary/5 rounded-2xl p-5 border border-primary/10" : ""}>
                      <div className={`flex items-center gap-2 mb-2 ${index === 0 ? 'text-primary' : 'text-slate-500'} font-semibold text-sm`}>
                        <Clock className="w-4 h-4" /> {appointment.time || "Pending Time"}
                      </div>
                      <h4 className={`font-bold ${index === 0 ? 'text-slate-900' : 'text-slate-800'}`}>
                        {appointment.doctorName || "Doctor"}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {appointment.date || "Pending Date"} - {appointment.status || "Scheduled"}
                      </p>
                      {appointment.hospital && index === 0 && (
                        <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 font-medium">
                          <Hospital className="w-3.5 h-3.5" /> {appointment.hospital}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button onClick={() => onNavigate('appointments')} className="w-full py-3.5 mt-4 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors">
              Manage Schedule
            </button>
          </section>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="mt-12 rounded-3xl bg-slate-900 text-slate-400 p-8 md:p-12 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <Activity className="h-6 w-6" />
              <span className="text-xl font-bold">OmniCare</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Revolutionizing healthcare access with real-time telemetry and seamless patient-doctor connectivity.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => onNavigate('doctors')} className="hover:text-white transition-colors">Find a Doctor</button></li>
              <li><button onClick={() => onNavigate('hospitals')} className="hover:text-white transition-colors">Live Hospitals Status</button></li>
              <li><button onClick={() => onNavigate('donors')} className="hover:text-white transition-colors">Blood Donor Network</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact & Emergency</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <div className="bg-red-500/20 p-2.5 rounded-full text-red-500"><Phone className="w-4 h-4" /></div>
                <div>
                  <p className="text-xs text-slate-400">Ambulance / Emergency</p>
                  <p className="text-white font-bold text-lg">108</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-slate-800 p-2.5 rounded-full text-slate-300"><Mail className="w-4 h-4" /></div>
                <div>
                  <p className="text-white font-medium">support@omnicare.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} OmniCare Technologies. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
