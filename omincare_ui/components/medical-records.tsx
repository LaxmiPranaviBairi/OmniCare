"use client";

import { FileText, ArrowLeft, FlaskConical, Heart, Thermometer } from "lucide-react";

interface MedicalRecordsProps {
  onNavigate: (page: string) => void;
}

const records = [
  {
    id: 1,
    title: "Blood Test Report",
    date: "15 Mar 2026",
    doctor: "Dr. Sarah Johnson",
    type: "Lab Report",
    icon: FlaskConical,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    title: "Cardiac ECG Report",
    date: "02 Feb 2026",
    doctor: "Dr. Arun Patel",
    type: "Cardiology",
    icon: Heart,
    color: "bg-rose-100 text-rose-600",
  },
  {
    id: 3,
    title: "General Health Checkup",
    date: "10 Jan 2026",
    doctor: "Dr. Robert Martinez",
    type: "Checkup",
    icon: Thermometer,
    color: "bg-green-100 text-green-600",
  },
];

export function MedicalRecords({ onNavigate }: MedicalRecordsProps) {
  return (
    <section className="py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => onNavigate("profile")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Profile
        </button>

        <h2 className="text-2xl font-bold text-foreground mb-2">Medical Records</h2>
        <p className="text-muted-foreground mb-6">Your health history and lab reports</p>

        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${record.color}`}>
                <record.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{record.title}</h3>
                <p className="text-sm text-muted-foreground">{record.doctor}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">{record.date}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {record.type}
                  </span>
                </div>
              </div>
              <button className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-xl border border-border hover:bg-accent transition-colors">
                View
              </button>
            </div>
          ))}
        </div>

        {/* Empty state hint */}
        <div className="mt-6 p-4 rounded-xl border border-dashed text-center text-sm text-muted-foreground">
          <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          More records will appear here as you visit doctors and complete checkups.
        </div>
      </div>
    </section>
  );
}
