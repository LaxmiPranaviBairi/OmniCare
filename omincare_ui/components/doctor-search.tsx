"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Star, MapPin, RefreshCw, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LiveStatusBadge } from "@/components/live-status-badge";
import { BookingModal } from "@/components/booking-modal";

type Status = "available" | "busy" | "high-demand";

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  status: Status;
  experience: string;
}

const SPECIALTIES = ["All Specialties", "Cardiologist", "Neurologist", "Pediatrician", "Orthopedic", "Dermatologist", "General Medicine"];

export function DoctorSearch() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedSpecialty !== "All Specialties") params.set("specialty", selectedSpecialty);
      const res = await fetch(`https://omnicare-6244.onrender.com/api/doctors?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch doctors");
      let data = await res.json();
      
      // Override with realistic mocked data if API returns less than 5 doctors (for live demo)
      if (data.length < 5) {
        data = [
          {
            _id: "doc1",
            name: "Dr. Ananya Reddy",
            specialty: "Cardiologist",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
            rating: 4.9,
            reviews: 127,
            location: "Apollo Hospitals, Jubilee Hills",
            status: "available",
            experience: "15 years"
          },
          {
            _id: "doc2",
            name: "Dr. Vikram Sharma",
            specialty: "Neurologist",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
            rating: 4.8,
            reviews: 98,
            location: "AIG Hospitals, Gachibowli",
            status: "busy",
            experience: "12 years"
          },
          {
            _id: "doc3",
            name: "Dr. Priya Patel",
            specialty: "Pediatrician",
            image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face",
            rating: 4.9,
            reviews: 215,
            location: "Apollo Hospitals, Jubilee Hills",
            status: "available",
            experience: "10 years"
          },
          {
            _id: "doc4",
            name: "Dr. Ramesh Rao",
            specialty: "Orthopedic",
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face",
            rating: 4.7,
            reviews: 89,
            location: "AIG Hospitals, Gachibowli",
            status: "high-demand",
            experience: "18 years"
          },
          {
            _id: "doc5",
            name: "Dr. Neha Singh",
            specialty: "Dermatologist",
            image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=face",
            rating: 4.8,
            reviews: 156,
            location: "Apollo Hospitals, Jubilee Hills",
            status: "available",
            experience: "8 years"
          },
          {
            _id: "doc6",
            name: "Dr. Amit Kumar",
            specialty: "General Medicine",
            image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face",
            rating: 4.6,
            reviews: 234,
            location: "AIG Hospitals, Gachibowli",
            status: "busy",
            experience: "20 years"
          }
        ];
        
        // Apply basic frontend filtering since we're mocking
        if (searchQuery) {
          data = data.filter((d: any) => 
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            d.specialty.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (selectedSpecialty !== "All Specialties") {
          data = data.filter((d: any) => d.specialty === selectedSpecialty);
        }
      }
      
      setDoctors(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedSpecialty]);

  useEffect(() => {
    const timer = setTimeout(fetchDoctors, 300); // debounce search
    return () => clearTimeout(timer);
  }, [fetchDoctors]);

  const handleBookNow = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <section id="doctors" className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Find Doctors</h2>
            <p className="text-muted-foreground">Search and book appointments with top specialists</p>
          </div>
          <button
            onClick={fetchDoctors}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-primary" : "text-slate-500"}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-6 rounded-2xl border-border bg-card text-base"
          />
        </div>

        {/* Specialty Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {SPECIALTIES.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                selectedSpecialty === specialty
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary"
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl border border-border p-4 shadow-sm">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-slate-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
                <div className="mt-4 h-10 bg-slate-200 rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600 text-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="font-bold text-lg">Failed to load doctors</p>
              <p className="text-sm text-red-500">{error}</p>
            </div>
            <button onClick={fetchDoctors} className="mt-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700">
              Try Again
            </button>
          </div>
        )}

        {/* Doctor Cards */}
        {!isLoading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor, index) => (
              <div
                key={doctor._id || doctor.name || index}
                className="bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || "Doctor")}&background=random`}
                    alt={doctor.name || "Doctor"}
                    className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{doctor.name}</h3>
                      <LiveStatusBadge status={doctor.status} showLabel={false} />
                    </div>
                    <p className="text-sm text-primary font-medium mb-1">{doctor.specialty || "General Medicine"}</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {doctor.experience ? `${doctor.experience} experience` : 'Experience: N/A'}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium text-foreground">{doctor.rating || 'New Doctor'}</span>
                        {doctor.reviews ? <span className="text-muted-foreground">({doctor.reviews})</span> : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{doctor.location}</span>
                </div>
                <Button
                  className="w-full mt-4 rounded-2xl"
                  onClick={() => handleBookNow(doctor)}
                >
                  Book Now
                </Button>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && doctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No doctors found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          doctor={selectedDoctor}
        />
      )}
    </section>
  );
}
