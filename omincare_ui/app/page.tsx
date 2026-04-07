
"use client"

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { HomeDashboard } from "@/components/home-dashboard";
import { DoctorSearch } from "@/components/doctor-search";
import { HospitalSearch } from "@/components/hospital-search";
import { BloodDonors } from "@/components/blood-donors";
import { Profile } from "@/components/profile";
import { Appointments } from "@/components/appointments";

export default function OmniCarePage() {
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={setActivePage} />

      <main className="container mx-auto p-4">
        {activePage === "home" && <HomeDashboard onNavigate={setActivePage} userName="John Doe" />}
        {activePage === "doctors" && <DoctorSearch />}
        {activePage === "hospitals" && <HospitalSearch />}
        {activePage === "donors" && <BloodDonors />}
        {activePage === "profile" && <Profile />}
        {activePage === "appointments" && <Appointments />}
      </main>
    </div>
  );
}
