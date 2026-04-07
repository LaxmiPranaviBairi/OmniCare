"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Droplets, MapPin, Check, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Donor {
  _id: string;
  name: string;
  bloodGroup: string;
  location: string;
  distance: string;
  lastDonation: string;
  image: string;
  available: boolean;
}

const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Registration form state type
interface RegisterForm {
  name: string;
  bloodGroup: string;
  location: string;
  phone: string;
}

export function BloodDonors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [requestedDonors, setRequestedDonors] = useState<string[]>([]);
  const [requestingId, setRequestingId] = useState<string | null>(null);

  // Registration modal state
  const [showRegister, setShowRegister] = useState(false);
  const [registerForm, setRegisterForm] = useState<RegisterForm>({ name: "", bloodGroup: "A+", location: "", phone: "" });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const fetchDonors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedGroup !== "All") params.set("bloodGroup", selectedGroup);
      const res = await fetch(`http://127.0.0.1:5000/api/donors?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch donors");
      const data = await res.json();
      setDonors(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedGroup]);

  useEffect(() => {
    const timer = setTimeout(fetchDonors, 300);
    return () => clearTimeout(timer);
  }, [fetchDonors]);

  const handleSendRequest = async (donor: Donor) => {
    setRequestingId(donor._id);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/blood-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId: donor._id, requesterName: "John Doe" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Request failed");
      }
      setRequestedDonors((prev) => [...prev, donor._id]);
    } catch (err: any) {
      alert(err.message || "Failed to send request.");
    } finally {
      setRequestingId(null);
    }
  };

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.bloodGroup) {
      setRegisterError("Name and blood group are required.");
      return;
    }
    setIsRegistering(true);
    setRegisterError(null);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/donors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }
      setRegisterSuccess(true);
      setTimeout(() => {
        setShowRegister(false);
        setRegisterSuccess(false);
        setRegisterForm({ name: "", bloodGroup: "A+", location: "", phone: "" });
      }, 2000);
    } catch (err: any) {
      setRegisterError(err.message || "Registration failed.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <section id="donors" className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Blood Donors</h2>
            <p className="text-muted-foreground">Find and connect with blood donors near you</p>
          </div>
          <button
            onClick={fetchDonors}
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
            placeholder="Search donors by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-6 rounded-2xl border-border bg-card text-base"
          />
        </div>

        {/* Blood Group Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {bloodGroups.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                selectedGroup === group
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-card hover:bg-accent"
              }`}
            >
              {group === "All" ? "All Groups" : group}
            </button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl border border-border p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                  <div className="w-24 h-10 bg-slate-200 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600 text-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="font-bold text-lg">Failed to load donors</p>
              <p className="text-sm text-red-500">{error}</p>
            </div>
            <button onClick={fetchDonors} className="mt-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700">
              Try Again
            </button>
          </div>
        )}

        {/* Donor List */}
        {!isLoading && !error && (
          <div className="space-y-3">
            {donors.map((donor) => (
              <div
                key={donor._id}
                className="bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={donor.image}
                    alt={donor.name}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{donor.name}</h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                          donor.bloodGroup.includes("-")
                            ? "bg-red-100 text-red-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {donor.bloodGroup}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {donor.location} ({donor.distance})
                      </span>
                      <span className="flex items-center gap-1">
                        <Droplets className="h-3.5 w-3.5" />
                        Last donated: {donor.lastDonation}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {requestedDonors.includes(donor._id) ? (
                      <Button variant="outline" className="rounded-2xl" disabled>
                        <Check className="h-4 w-4 mr-1" />
                        Requested
                      </Button>
                    ) : donor.available ? (
                      <Button
                        className="rounded-2xl"
                        onClick={() => handleSendRequest(donor)}
                        disabled={requestingId === donor._id}
                      >
                        {requestingId === donor._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Send Request"
                        )}
                      </Button>
                    ) : (
                      <Button variant="outline" className="rounded-2xl" disabled>
                        Unavailable
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && donors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Droplets className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No donors found matching your criteria.</p>
          </div>
        )}

        {/* Become a Donor CTA */}
        <div className="mt-8 p-6 bg-gradient-to-r from-rose-500 to-red-500 rounded-2xl text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">Become a Blood Donor</h3>
              <p className="text-white/80">Your donation can save up to 3 lives. Register today!</p>
            </div>
            <Button
              className="bg-white text-rose-600 hover:bg-white/90 rounded-2xl"
              onClick={() => setShowRegister(true)}
            >
              Register as Donor
            </Button>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setShowRegister(false)} />
          <div className="relative w-full max-w-md bg-card rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border bg-rose-500/10">
              <h2 className="text-lg font-semibold text-foreground">Register as Donor</h2>
              <button onClick={() => setShowRegister(false)} className="p-2 hover:bg-accent rounded-full transition-colors">
                <span className="text-muted-foreground text-lg">✕</span>
              </button>
            </div>

            {registerSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Registered!</h3>
                <p className="text-muted-foreground">Thank you for signing up as a blood donor.</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                  <input
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your full name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Blood Group *</label>
                  <select
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={registerForm.bloodGroup}
                    onChange={(e) => setRegisterForm((f) => ({ ...f, bloodGroup: e.target.value }))}
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Location</label>
                  <input
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your area / district"
                    value={registerForm.location}
                    onChange={(e) => setRegisterForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                  <input
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+91 9876543210"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                {registerError && (
                  <p className="text-sm text-red-600 font-medium">{registerError}</p>
                )}
                <Button
                  className="w-full rounded-2xl bg-rose-600 hover:bg-rose-700"
                  onClick={handleRegister}
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Registering...</>
                  ) : (
                    "Register Now"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
