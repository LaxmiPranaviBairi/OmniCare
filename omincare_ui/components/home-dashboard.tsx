
"use client"

import { Search, Hospital, Droplets, Calendar } from "lucide-react"

interface HomeDashboardProps {
  onNavigate: (page: string) => void
  userName: string
}

export function HomeDashboard({ onNavigate, userName }: HomeDashboardProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold">Welcome, {userName}</h1>
        <p className="text-muted-foreground text-sm">How can we help you today?</p>
      </header>

      {/* Main Grid - These match your 4 buttons from Pinterest */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => onNavigate('doctors')}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-6 shadow-sm border hover:border-primary transition-all text-center"
        >
          <div className="rounded-full bg-blue-100 p-3 text-blue-600"><Search /></div>
          <span className="font-semibold text-sm">Find Doctor</span>
        </button>

        <button 
          onClick={() => onNavigate('hospitals')}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-6 shadow-sm border hover:border-primary transition-all text-center"
        >
          <div className="rounded-full bg-green-100 p-3 text-green-600"><Hospital /></div>
          <span className="font-semibold text-sm">Nearby Hospitals</span>
        </button>

        <button 
          onClick={() => onNavigate('donors')}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-6 shadow-sm border hover:border-primary transition-all text-center"
        >
          <div className="rounded-full bg-red-100 p-3 text-red-600"><Droplets /></div>
          <span className="font-semibold text-sm">Blood Donors</span>
        </button>

        <button 
          onClick={() => onNavigate('appointments')}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-6 shadow-sm border hover:border-primary transition-all text-center"
        >
          <div className="rounded-full bg-purple-100 p-3 text-purple-600"><Calendar /></div>
          <span className="font-semibold text-sm">Appointments</span>
        </button>
      </div>

      <div className="rounded-2xl bg-primary/5 p-8 border border-primary/10 text-center">
        <h2 className="font-bold text-lg mb-2">OmniCare Unique Feature</h2>
        <p className="text-sm text-muted-foreground">Our Live-Load Tracking is currently monitoring 15 hospitals in your area.</p>
      </div>
    </div>
  )
}
/*"use client";

import { Calendar, FileText, Building2, Droplets, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

function ServiceCard({ icon: Icon, title, description, color, bgColor }: ServiceCardProps) {
  return (
    <div className="group p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer">
      <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`h-7 w-7 ${color}`} />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

const services = [
  {
    icon: Calendar,
    title: "Book Appointment",
    description: "Schedule visits with doctors",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: FileText,
    title: "Medical Reports",
    description: "View your lab results",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Building2,
    title: "Emergency Hospitals",
    description: "Find nearby hospitals",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    icon: Droplets,
    title: "Blood Donors",
    description: "Connect with donors",
    color: "text-rose-600",
    bgColor: "bg-rose-100",
  },
];

interface HomeDashboardProps {
  userName: string;
}

export function HomeDashboard({ userName }: HomeDashboardProps) {
  return (
    <section id="home" className="py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Header *//*}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xl">👋</span>
            </div>
            <div>
              <p className="text-muted-foreground">Welcome back,</p>
              <h1 className="text-2xl font-bold text-foreground">{userName}</h1>
            </div>
          </div>
        </div>

        {/* Search Bar *//*}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search doctors, hospitals, or services..."
            className="pl-12 pr-4 py-6 rounded-2xl border-border bg-card text-base"
          />
        </div>

        {/* Quick Stats Banner *//*}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 mb-8 text-primary-foreground">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Your Health Overview</h2>
              <p className="text-primary-foreground/80">Track your appointments and health records</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold">3</p>
                <p className="text-sm text-primary-foreground/80">Appointments</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-primary-foreground/80">Reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Cards - 2x2 Grid *//*}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Services</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}*/
