"use client";

import { useState, useEffect } from "react";
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
    location?: string;
    hospital?: string;
  };
}

const timeSlots = ["10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM"];

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
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dates = getUpcomingDates();

  useEffect(() => {
    if (!selectedDate || !isOpen) return;

    const checkSlots = async () => {
      try {
        const res = await fetch(
          `https://omnicare-6244.onrender.com/api/appointments/check?doctorName=${encodeURIComponent(doctor.name)}&date=${encodeURIComponent(selectedDate)}`
        );
        if (res.ok) {
          const data = await res.json();
          setBookedSlots(data);
        }
      } catch (err) {
        console.error("Failed to fetch booked slots:", err);
      }
    };
    checkSlots();
  }, [selectedDate, isOpen, doctor.name]);

  if (!isOpen) return null;

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return;
    setIsLoading(true);
    setError(null);
    try {
      const userStr = localStorage.getItem("omnicare_user");
      const user = userStr ? JSON.parse(userStr) : { name: "John Doe" };

      const res = await fetch("https://omnicare-6244.onrender.com/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctor._id || `mock-${doctor.name}`,
          doctorName: doctor.name,
          doctorSpecialty: doctor.specialty,
          doctorImage: doctor.image,
          patientName: user.name,
          hospital: doctor.hospital || doctor.location || "N/A",
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
        setBookedSlots([]);
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
                src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || "Doctor")}&background=random`}
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
                    onClick={() => {
                      setSelectedDate(d.full);
                      setSelectedTime(null);
                    }}
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
              {selectedDate ? (
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((time) => {
                    const isTaken = bookedSlots.includes(time);
                    return (
                      <button
                        key={time}
                        onClick={() => !isTaken && setSelectedTime(time)}
                        disabled={isTaken}
                        className={`px-3 py-2 text-sm rounded-2xl border transition-colors ${
                          isTaken
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50"
                            : selectedTime === time
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border hover:border-primary"
                        }`}
                      >
                        {time} {isTaken && "(Booked)"}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-2">
                  Please select a date first
                </div>
              )}
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
