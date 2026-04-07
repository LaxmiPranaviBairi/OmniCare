"use client"

import { Activity, LayoutDashboard, Search, Hospital, Droplets, User } from "lucide-react"

interface NavbarProps {
  onNavigate: (page: string) => void
}

export function Navbar({ onNavigate }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo - Clicks back to Home */}
        <div 
          className="flex items-center gap-2 font-bold text-primary cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <Activity className="h-6 w-6" />
          <span className="text-xl tracking-tight">OmniCare</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button onClick={() => onNavigate('home')} className="transition-colors hover:text-primary flex items-center gap-1">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </button>
          <button onClick={() => onNavigate('doctors')} className="transition-colors hover:text-primary flex items-center gap-1">
            <Search className="h-4 w-4" /> Doctors
          </button>
          <button onClick={() => onNavigate('hospitals')} className="transition-colors hover:text-primary flex items-center gap-1">
            <Hospital className="h-4 w-4" /> Hospitals
          </button>
          <button onClick={() => onNavigate('donors')} className="transition-colors hover:text-primary flex items-center gap-1">
            <Droplets className="h-4 w-4 text-red-500" /> Donors
          </button>
        </div>

        {/* Profile Button */}
        <button 
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 rounded-full border p-1 px-3 hover:bg-muted transition-colors"
        >
          <User className="h-4 w-4" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </nav>
  )
}

/*"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, X, Home, Search, MapPin, Droplets, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Search Doctors", href: "#doctors", icon: Search },
  { name: "Nearby Hospitals", href: "#hospitals", icon: MapPin },
  { name: "Blood Donors", href: "#donors", icon: Droplets },
  { name: "Profile", href: "#profile", icon: User },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo *//*}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">OmniCare</span>
          </Link>

          {/* Desktop Navigation *//*}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-2xl transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button *//*}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation *//*}
        {isOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-2xl transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}*/
