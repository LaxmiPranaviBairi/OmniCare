"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface Appointment {
  _id: string;
  patientName: string;
  hospital: string;
  doctorName: string;
  date: string;
  time: string;
  status: "Pending" | "Completed";
}

const statusStyles = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userStr = localStorage.getItem("omnicare_user") || localStorage.getItem("user");
      let patientName = "Guest";
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          patientName = user.name || "Guest";
        } catch (e) {
          patientName = "Guest";
        }
      }

      const res = await fetch(`http://127.0.0.1:5000/api/appointments?patientName=${encodeURIComponent(patientName)}`);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <section id="appointments" className="py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">My Appointments</h2>
            <p className="text-muted-foreground">Your upcoming and past bookings</p>
          </div>
          <button
            onClick={fetchAppointments}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-primary" : "text-slate-500"}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl border border-border p-5 shadow-sm">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-5 bg-slate-200 rounded w-1/2" />
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600 text-center">
            <AlertCircle className="h-8 w-8" />
            <div>
              <p className="font-bold text-lg">Failed to load appointments</p>
              <p className="text-sm text-red-500">{error}</p>
            </div>
            <button onClick={fetchAppointments} className="mt-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && appointments.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-dashed bg-card">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="font-semibold text-foreground mb-1">No appointments yet</p>
            <p className="text-sm text-muted-foreground">Book a doctor from the Find Doctor section.</p>
          </div>
        )}

        {/* Appointment Cards */}
        {!isLoading && !error && appointments.length > 0 && (
          <div className="space-y-4">
            {appointments.map((appt, index) => (
              <div
                key={appt._id || index}
                className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {appt.hospital && !["Unknown Hospital", "N/A"].includes(appt.hospital) ? appt.hospital : "OmniCare Partner Clinic"}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full capitalize ${statusStyles[appt.status] || "bg-slate-100 text-slate-700"}`}>
                        {appt.status}
                      </span>
                    </div>
                    {appt.doctorName && (
                      <p className="text-sm text-primary font-medium mb-2">
                        {appt.doctorName.startsWith('Dr.') ? appt.doctorName : `Dr. ${appt.doctorName}`}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                      {appt.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> {appt.date}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {appt.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
