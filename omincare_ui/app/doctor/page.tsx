"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DoctorDashboard } from "@/components/doctor-dashboard";

export default function DoctorPage() {
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("omnicare_user");
    if (!userStr) {
      router.push("/login");
    } else {
      try {
        const user = JSON.parse(userStr);
        if (user.role !== "doctor") {
          router.push("/");
        }
      } catch (e) {
        // ignore
      }
    }
  }, [router]);

  return (
    <DoctorDashboard onNavigate={() => {}} />
  );
}
