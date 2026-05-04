"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Users, Navigation, RefreshCw, AlertCircle, Clock, CheckCircle, X } from "lucide-react";

interface Hospital {
  _id: string;
  name: string;
  location: string;
  status: string;
  load_percent: number;
  color?: string;
}

// Utility mapper to ensure Tailwind doesn't purge dynamically constructed classes
function parseColors(colorString: string) {
  const colorMatch = colorString.match(/(red|green|yellow|blue|orange|purple|gray)/i);
  const colorName = colorMatch ? colorMatch[0].toLowerCase() : "gray";
  
  const colorMap: Record<string, { badgeColor: string, textColor: string, bgColor: string }> = {
    red: { badgeColor: "bg-red-500", textColor: "text-red-600", bgColor: "bg-red-50" },
    green: { badgeColor: "bg-green-500", textColor: "text-green-600", bgColor: "bg-green-50" },
    yellow: { badgeColor: "bg-yellow-500", textColor: "text-yellow-600", bgColor: "bg-yellow-50" },
    blue: { badgeColor: "bg-blue-500", textColor: "text-blue-600", bgColor: "bg-blue-50" },
    orange: { badgeColor: "bg-orange-500", textColor: "text-orange-600", bgColor: "bg-orange-50" },
    purple: { badgeColor: "bg-purple-500", textColor: "text-purple-600", bgColor: "bg-purple-50" },
    gray: { badgeColor: "bg-gray-500", textColor: "text-gray-600", bgColor: "bg-gray-50" },
  };

  return colorMap[colorName] || colorMap["gray"];
}

export function HospitalSearch() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<{ _id: string, name: string, specialty?: string, specialization?: string }[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  const timeSlots = ["10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM"];

  useEffect(() => {
    if (selectedHospital) {
      fetch(`http://127.0.0.1:5000/api/doctors?hospital=${encodeURIComponent(selectedHospital)}`)
        .then(res => res.json())
        .then(data => {
          console.log('Fetched doctors:', data);
          setDoctors(data);
        })
        .catch(err => console.error("Failed to fetch doctors", err));
    } else {
      setDoctors([]);
      setSelectedDoctor("");
      setBookingDate("");
      setBookingTime("");
      setBookedSlots([]);
    }
  }, [selectedHospital]);

  useEffect(() => {
    if (selectedDoctor && bookingDate) {
      fetch(`http://127.0.0.1:5000/api/appointments/check?doctorName=${encodeURIComponent(selectedDoctor)}&date=${encodeURIComponent(bookingDate)}`)
        .then(res => res.json())
        .then(data => setBookedSlots(data))
        .catch(err => console.error("Failed to fetch booked slots", err));
    } else {
      setBookedSlots([]);
    }
  }, [selectedDoctor, bookingDate]);

  const confirmBooking = async () => {
    if (!selectedHospital || !selectedDoctor || !bookingDate || !bookingTime) return;
    try {
      const userStr = localStorage.getItem('omnicare_user') || localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : { name: "Guest" };

      const res = await fetch('http://127.0.0.1:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: user.name || "Guest",
          hospital: selectedHospital,
          doctorName: selectedDoctor,
          date: bookingDate,
          time: bookingTime
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to book appointment');
      }

      setSuccessMsg(`Successfully booked appointment at ${selectedHospital} for ${bookingDate} at ${bookingTime}`);
      setTimeout(() => setSuccessMsg(null), 5000); // clear after 5s
      setSelectedHospital(null);
      setBookingDate("");
      setBookingTime("");
    } catch (err: any) {
      console.error("Booking Error:", err);
      alert('Failed to book. Please try again.');
    }
  };

  const fetchHospitals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/hospitals');
      if (!res.ok) {
        throw new Error('Failed to fetch hospital data');
      }
      const data = await res.json();
      setHospitals(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {successMsg && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 mb-6 flex items-center gap-3 text-green-800 shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <p className="font-medium text-sm">{successMsg}</p>
        </div>
      )}

      <header className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Nearby Hospitals</h2>
          <p className="text-sm text-muted-foreground">Real-time occupancy and load tracking</p>
        </div>
        <button 
          onClick={fetchHospitals}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-primary" : "text-slate-500"}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </header>

      <div className="grid gap-4">
        {isLoading && (
          [1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="animate-pulse flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-3 w-1/2">
                   <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                   <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
              </div>
              <div className="mt-4 pt-4 border-t border-dashed flex justify-between">
                <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                <div className="h-8 w-28 bg-slate-200 rounded-xl"></div>
              </div>
            </div>
          ))
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600 text-center">
             <AlertCircle className="h-8 w-8 text-red-500" />
             <div>
               <p className="font-bold text-lg">Failed to load data</p>
               <p className="text-sm text-red-500">{error}</p>
             </div>
             <button onClick={fetchHospitals} className="mt-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition-opacity hover:bg-red-700">
               Try Again
             </button>
          </div>
        )}

        {!isLoading && !error && hospitals.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-white p-12 text-center shadow-sm">
            <p className="text-muted-foreground font-medium">No hospitals found nearby.</p>
          </div>
        )}

        {!isLoading && !error && hospitals.map((hospital, index) => {
          const { badgeColor, textColor, bgColor } = parseColors(hospital.color || "bg-gray-500");
          
          return (
            <div key={hospital._id || hospital.name || index} className="group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{hospital.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" /> {hospital.location}
                  </div>
                </div>
                
                {/* THIS IS THE UNIQUE FEATURE: LIVE LOAD BADGE */}
                <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${bgColor} ${textColor} text-xs font-bold border border-current/20`}>
                  <span className={`h-2 w-2 rounded-full ${badgeColor} animate-pulse`}></span>
                  {hospital.status} ({hospital.load_percent}%)
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-4 border-t border-dashed">
                <div className="flex gap-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" /> 12 Doctors on call
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedHospital(hospital.name)}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-opacity hover:bg-blue-700 flex items-center gap-2 shadow-sm"
                  >
                    <Clock className="h-3 w-3" /> Book Appointment
                  </button>
                  <button className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 flex items-center gap-2 shadow-sm">
                    <Navigation className="h-3 w-3" /> Get Directions
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedHospital(null)} 
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-1">Book Appointment</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Hospital: <span className="font-semibold text-foreground">{selectedHospital}</span>
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-foreground">Select Doctor</label>
                <select 
                  value={selectedDoctor}
                  onChange={(e) => { setSelectedDoctor(e.target.value); setBookingTime(""); }}
                  className="w-full p-2.5 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                >
                  <option value="" disabled>Choose a doctor</option>
                  {doctors.map(d => (
                    <option key={d._id || d.name} value={d.name}>{d.name} ({d.specialization || d.specialty})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-foreground">Select Date</label>
                <input 
                  type="date" 
                  value={bookingDate}
                  onChange={(e) => { setBookingDate(e.target.value); setBookingTime(""); }}
                  className="w-full p-2.5 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-foreground">Select Time</label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(time => {
                    const isBooked = bookedSlots.includes(time);
                    return (
                      <button 
                        key={time}
                        onClick={() => setBookingTime(time)}
                        disabled={isBooked || !bookingDate || !selectedDoctor}
                        className={`p-2.5 border rounded-xl text-sm font-medium transition-colors ${
                          isBooked 
                            ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-60' 
                            : bookingTime === time 
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                              : 'bg-background hover:border-primary hover:bg-slate-50'
                        }`}
                      >
                        {time} {isBooked && "(Booked)"}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="pt-2">
                <button 
                  onClick={confirmBooking}
                  disabled={!selectedDoctor || !bookingDate || !bookingTime}
                  className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-sm"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}