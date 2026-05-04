
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { HomeDashboard } from "@/components/home-dashboard";
import { DoctorSearch } from "@/components/doctor-search";
import { HospitalSearch } from "@/components/hospital-search";
import { BloodDonors } from "@/components/blood-donors";
import { Profile } from "@/components/profile";
import { Appointments } from "@/components/appointments";
import { EditProfile } from "@/components/edit-profile";
import { MedicalRecords } from "@/components/medical-records";
import { DoctorDashboard } from "@/components/doctor-dashboard";

export default function OmniCarePage() {
  const router = useRouter();
  const [activePage, setActivePage] = useState("home");
  const [userName, setUserName] = useState("John Doe");

  useEffect(() => {
    const userStr = localStorage.getItem("omnicare_user");
    if (!userStr) {
      router.push("/login");
    } else {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name);
      } catch (e) {
        // ignore
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={setActivePage} />

      <main className="container mx-auto p-4">
        <div className="mb-4 flex justify-end">
          <Link href="/doctor" className="text-sm font-medium text-primary hover:underline border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-md">
            Go to Doctor Dashboard
          </Link>
        </div>

        {activePage === "home" && <HomeDashboard onNavigate={setActivePage} userName={userName} />}
        {activePage === "doctors" && <DoctorSearch />}
        {activePage === "hospitals" && <HospitalSearch />}
        {activePage === "donors" && <BloodDonors />}
        {activePage === "profile" && <Profile onNavigate={setActivePage} />}
        {activePage === "appointments" && <Appointments />}
        {activePage === "edit-profile" && <EditProfile onNavigate={setActivePage} />}
        {activePage === "medical-records" && <MedicalRecords onNavigate={setActivePage} />}
        {activePage === "doctor" && <DoctorDashboard onNavigate={setActivePage} />}
      </main>
    </div>
  );
}
