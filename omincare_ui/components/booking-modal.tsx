"use client";

import { useState } from "react";
import { X, Calendar, Clock, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: {
    _id: string;
    name: string;
    specialty: string;
    image: string;
  };
}

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

// Generate next 5 weekdays dynamically
function getUpcomingDates() {
  const dates = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let d = new Date();
  d.setDate(d.getDate() + 1);
  while (dates.length < 5) {
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      dates.push({
        day: dayNames[d.getDay()],
        date: String(d.getDate()),
        month: monthNames[d.getMonth()],
        full: `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]}`,
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

export function BookingModal({ isOpen, onClose, doctor }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dates = getUpcomingDates();

  if (!isOpen) return null;

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctor._id,
          doctorName: doctor.name,
          doctorSpecialty: doctor.specialty,
          doctorImage: doctor.image,
          patientName: "John Doe", // replace with real user when auth is added
          date: selectedDate,
          time: selectedTime,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Booking failed");
      }
      setIsBooked(true);
      setTimeout(() => {
        setIsBooked(false);
        setSelectedDate(null);
        setSelectedTime(null);
        onClose();
      }, 2200);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5">
          <h2 className="text-lg font-semibold text-foreground">Book Appointment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {isBooked ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Booking Confirmed!</h3>
            <p className="text-muted-foreground">
              Your appointment with {doctor.name} on {selectedDate} at {selectedTime} has been scheduled.
            </p>
          </div>
        ) : (
          <>
            {/* Doctor Info */}
            <div className="p-4 flex items-center gap-4 border-b border-border">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div>
                <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              </div>
            </div>

            {/* Date Selection */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Select Date</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((d) => (
                  <button
                    key={d.full}
                    onClick={() => setSelectedDate(d.full)}
                    className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-2xl border transition-colors ${
                      selectedDate === d.full
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary"
                    }`}
                  >
                    <span className="text-xs">{d.day}</span>
                    <span className="text-lg font-semibold">{d.date}</span>
                    <span className="text-xs">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Select Time</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-3 py-2 text-sm rounded-2xl border transition-colors ${
                      selectedTime === time
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 pb-2 text-sm text-red-600 font-medium text-center">{error}</div>
            )}

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <Button
                className="w-full rounded-2xl"
                onClick={handleBook}
                disabled={!selectedDate || !selectedTime || isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Booking...</>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
