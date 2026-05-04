"use client";

import { useState, useEffect } from "react";
import {
  User,
  FileText,
  Calendar,
  Bell,
  CreditCard,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  Heart,
  Droplets,
  Activity,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick?: () => void;
  danger?: boolean;
}

function MenuItem({ icon: Icon, label, description, onClick, danger }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-colors ${
        danger
          ? "hover:bg-red-50 text-red-600"
          : "hover:bg-accent"
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        danger ? "bg-red-100" : "bg-primary/10"
      }`}>
        <Icon className={`h-5 w-5 ${danger ? "text-red-600" : "text-primary"}`} />
      </div>
      <div className="flex-1 text-left">
        <p className={`font-medium ${danger ? "text-red-600" : "text-foreground"}`}>{label}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <ChevronRight className={`h-5 w-5 ${danger ? "text-red-400" : "text-muted-foreground"}`} />
    </button>
  );
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  image: string;
  stats: {
    heartRate: number;
    bloodPressure: string;
    appointmentCount: number;
  };
}

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export function Profile({ onNavigate }: ProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("http://127.0.0.1:5000/api/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <section id="profile" className="py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Profile</h2>
          <div className="animate-pulse space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-36" />
                  <div className="h-4 bg-slate-100 rounded w-48" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-2 space-y-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section id="profile" className="py-8">
        <div className="container mx-auto px-4 max-w-2xl text-center py-16">
          <p className="text-red-600 font-medium">{error || "Profile unavailable."}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="profile" className="py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Profile</h2>

        {/* User Card */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={profile.image}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
            />
            <div>
              <h3 className="text-xl font-semibold text-foreground">{profile.name}</h3>
              <p className="text-muted-foreground">{profile.email}</p>
              <p className="text-sm text-muted-foreground">{profile.phone}</p>
            </div>
          </div>

          {/* Health Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-2xl">
              <div className="w-10 h-10 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">{profile.stats.heartRate}</p>
              <p className="text-xs text-muted-foreground">Heart Rate</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-2xl">
              <div className="w-10 h-10 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">{profile.stats.bloodPressure}</p>
              <p className="text-xs text-muted-foreground">Blood Pressure</p>
            </div>
            <div className="text-center p-4 bg-rose-50 rounded-2xl">
              <div className="w-10 h-10 mx-auto mb-2 bg-rose-100 rounded-full flex items-center justify-center">
                <Droplets className="h-5 w-5 text-rose-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">{profile.bloodGroup}</p>
              <p className="text-xs text-muted-foreground">Blood Group</p>
            </div>
          </div>

          {/* Appointment count badge */}
          {profile.stats.appointmentCount > 0 && (
            <div className="mt-4 p-3 bg-primary/5 rounded-xl text-center border border-primary/10">
              <p className="text-sm text-primary font-medium">
                🗓️ {profile.stats.appointmentCount} confirmed appointment{profile.stats.appointmentCount !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-2">
            <MenuItem
              icon={User}
              label="My Profile"
              description="Edit your personal information"
              onClick={() => onNavigate('edit-profile')}
            />
            <MenuItem
              icon={FileText}
              label="Medical Records"
              description="View your health history"
              onClick={() => onNavigate('medical-records')}
            />
            <MenuItem
              icon={Calendar}
              label="My Appointments"
              description="Upcoming and past bookings"
              onClick={() => onNavigate('appointments')}
            />
            <MenuItem
              icon={Bell}
              label="Notifications"
              description="Manage your alerts"
            />
            <MenuItem
              icon={CreditCard}
              label="Payment History"
              description="View your transactions"
            />
            <MenuItem
              icon={HelpCircle}
              label="Help & Support"
              description="Get assistance"
            />
            <MenuItem
              icon={Settings}
              label="Settings"
              description="App preferences"
            />
          </div>

          <div className="border-t border-border p-2">
            <MenuItem
              icon={LogOut}
              label="Log Out"
              danger
            />
          </div>
        </div>

        {/* App Version */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          OmniCare v1.0.0
        </p>
      </div>
    </section>
  );
}
