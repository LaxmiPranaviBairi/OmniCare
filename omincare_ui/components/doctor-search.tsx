"use client";

import { useState, useMemo } from "react";
import { Search, Star, MapPin, CalendarClock, IndianRupee, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DoctorSearchProps {
  initialSearch?: string;
  onNavigate?: (page: string, query?: string) => void;
}

const MOCK_DOCTORS = [
  { id: "1", name: "Dr. Ananya Reddy", specialty: "Cardiology", rating: 4.9, reviews: 127, experience: "15 years", fees: "₹800", location: "Apollo Hospitals, Jubilee Hills", availability: "Today" },
  { id: "2", name: "Dr. Vikram Sharma", specialty: "Neurology", rating: 4.8, reviews: 98, experience: "12 years", fees: "₹1000", location: "AIG Hospitals, Gachibowli", availability: "Tomorrow" },
  { id: "3", name: "Dr. Priya Patel", specialty: "Pediatrics", rating: 4.9, reviews: 215, experience: "10 years", fees: "₹600", location: "Apollo Hospitals, Jubilee Hills", availability: "Today" },
  { id: "4", name: "Dr. Ramesh Rao", specialty: "Orthopedics", rating: 4.7, reviews: 89, experience: "18 years", fees: "₹900", location: "AIG Hospitals, Gachibowli", availability: "Tomorrow" },
  { id: "5", name: "Dr. Neha Singh", specialty: "Dermatology", rating: 4.8, reviews: 156, experience: "8 years", fees: "₹700", location: "Apollo Hospitals, Jubilee Hills", availability: "Today" },
  { id: "6", name: "Dr. Amit Kumar", specialty: "General Medicine", rating: 4.6, reviews: 234, experience: "20 years", fees: "₹500", location: "AIG Hospitals, Gachibowli", availability: "Today" },
  { id: "7", name: "Dr. Sneha Desai", specialty: "Gynecology", rating: 4.9, reviews: 312, experience: "14 years", fees: "₹850", location: "KIMS Hospital, Secunderabad", availability: "Tomorrow" },
  { id: "8", name: "Dr. Rajesh Iyer", specialty: "Ophthalmology", rating: 4.7, reviews: 145, experience: "11 years", fees: "₹650", location: "LV Prasad Eye Institute", availability: "Today" },
  { id: "9", name: "Dr. Kavita Verma", specialty: "Dentistry", rating: 4.8, reviews: 198, experience: "9 years", fees: "₹400", location: "Care Hospitals, Banjara Hills", availability: "Tomorrow" },
  { id: "10", name: "Dr. Suresh Menon", specialty: "Psychiatry", rating: 4.9, reviews: 87, experience: "16 years", fees: "₹1200", location: "MindCare Clinic, Madhapur", availability: "Today" },
];

const SPECIALTIES = ["All", "Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Dermatology", "General Medicine", "Gynecology", "Ophthalmology", "Dentistry", "Psychiatry"];
const AVAILABILITY = ["All", "Today", "Tomorrow"];

export function DoctorSearch({ initialSearch, onNavigate }: DoctorSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");

  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
      const matchesAvailability = selectedAvailability === "All" || doc.availability === selectedAvailability;
      
      return matchesSearch && matchesSpecialty && matchesAvailability;
    });
  }, [searchQuery, selectedSpecialty, selectedAvailability]);

  const handleBookNow = (doctorName: string) => {
    if (onNavigate) {
      onNavigate('appointments', doctorName);
    }
  };

  return (
    <section className="py-8 animate-in fade-in duration-500">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8 border-b pb-6">
          <h2 className="text-3xl font-extrabold text-slate-900">Find Specialists</h2>
          <p className="text-slate-500 mt-2 text-lg">Browse our directory of top-rated healthcare professionals.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4 space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4 font-bold text-slate-800">
                <Filter className="w-5 h-5 text-primary" />
                Filters
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Doctor name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Specialty */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Specialty</label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {SPECIALTIES.map(specialty => (
                    <label key={specialty} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="specialty" 
                        value={specialty}
                        checked={selectedSpecialty === specialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                      />
                      <span className={`text-sm ${selectedSpecialty === specialty ? 'font-semibold text-slate-900' : 'text-slate-600 group-hover:text-slate-900'} transition-colors`}>
                        {specialty}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Availability</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {AVAILABILITY.map(avail => (
                    <button
                      key={avail}
                      onClick={() => setSelectedAvailability(avail)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${selectedAvailability === avail ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {avail}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Main Content Grid */}
          <div className="w-full lg:w-3/4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-slate-700">{filteredDoctors.length} results found</span>
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No doctors found</h3>
                <p className="text-slate-500">Try adjusting your filters or search query.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedSpecialty("All"); setSelectedAvailability("All"); }}
                  className="mt-6 text-primary font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDoctors.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col group">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Initials Badge */}
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl flex-shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        {doc.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">{doc.name}</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">{doc.specialty}</p>
                        
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-sm text-slate-800">{doc.rating}</span>
                          <span className="text-xs text-slate-500">({doc.reviews})</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-2 mb-6 flex-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarClock className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{doc.experience}</span> experience
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <IndianRupee className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{doc.fees}</span> consultation fee
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{doc.location}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${doc.availability === 'Today' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        Available {doc.availability}
                      </span>
                      <Button 
                        onClick={() => handleBookNow(doc.name)}
                        className="rounded-xl shadow-sm hover:shadow-md transition-all font-semibold"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
