"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Users, Navigation, RefreshCw, AlertCircle } from "lucide-react";

interface Hospital {
  _id: string;
  name: string;
  location: string;
  status: string;
  load_percent: number;
  color?: string;
}

// Utility mapper to ensure Tailwind doesn't purge dynamically constructed classes
function parseColors(colorString: string) {
  const colorMatch = colorString.match(/(red|green|yellow|blue|orange|purple|gray)/i);
  const colorName = colorMatch ? colorMatch[0].toLowerCase() : "gray";
  
  const colorMap: Record<string, { badgeColor: string, textColor: string, bgColor: string }> = {
    red: { badgeColor: "bg-red-500", textColor: "text-red-600", bgColor: "bg-red-50" },
    green: { badgeColor: "bg-green-500", textColor: "text-green-600", bgColor: "bg-green-50" },
    yellow: { badgeColor: "bg-yellow-500", textColor: "text-yellow-600", bgColor: "bg-yellow-50" },
    blue: { badgeColor: "bg-blue-500", textColor: "text-blue-600", bgColor: "bg-blue-50" },
    orange: { badgeColor: "bg-orange-500", textColor: "text-orange-600", bgColor: "bg-orange-50" },
    purple: { badgeColor: "bg-purple-500", textColor: "text-purple-600", bgColor: "bg-purple-50" },
    gray: { badgeColor: "bg-gray-500", textColor: "text-gray-600", bgColor: "bg-gray-50" },
  };

  return colorMap[colorName] || colorMap["gray"];
}

export function HospitalSearch() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHospitals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/hospitals');
      if (!res.ok) {
        throw new Error('Failed to fetch hospital data');
      }
      const data = await res.json();
      setHospitals(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Nearby Hospitals</h2>
          <p className="text-sm text-muted-foreground">Real-time occupancy and load tracking</p>
        </div>
        <button 
          onClick={fetchHospitals}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-primary" : "text-slate-500"}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </header>

      <div className="grid gap-4">
        {isLoading && (
          [1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="animate-pulse flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-3 w-1/2">
                   <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                   <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
              </div>
              <div className="mt-4 pt-4 border-t border-dashed flex justify-between">
                <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                <div className="h-8 w-28 bg-slate-200 rounded-xl"></div>
              </div>
            </div>
          ))
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600 text-center">
             <AlertCircle className="h-8 w-8 text-red-500" />
             <div>
               <p className="font-bold text-lg">Failed to load data</p>
               <p className="text-sm text-red-500">{error}</p>
             </div>
             <button onClick={fetchHospitals} className="mt-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition-opacity hover:bg-red-700">
               Try Again
             </button>
          </div>
        )}

        {!isLoading && !error && hospitals.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-white p-12 text-center shadow-sm">
            <p className="text-muted-foreground font-medium">No hospitals found nearby.</p>
          </div>
        )}

        {!isLoading && !error && hospitals.map((hospital) => {
          const { badgeColor, textColor, bgColor } = parseColors(hospital.color || "bg-gray-500");
          
          return (
            <div key={hospital._id} className="group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{hospital.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" /> {hospital.location}
                  </div>
                </div>
                
                {/* THIS IS THE UNIQUE FEATURE: LIVE LOAD BADGE */}
                <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${bgColor} ${textColor} text-xs font-bold border border-current/20`}>
                  <span className={`h-2 w-2 rounded-full ${badgeColor} animate-pulse`}></span>
                  {hospital.status} ({hospital.load_percent}%)
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-4 border-t border-dashed">
                <div className="flex gap-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" /> 12 Doctors on call
                  </div>
                </div>
                <button className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 flex items-center gap-2 shadow-sm">
                  <Navigation className="h-3 w-3" /> Get Directions
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}