"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Mail, Lock, UserRound, Stethoscope, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to login");
      }

      // Save to localStorage for session persistence
      localStorage.setItem("omnicare_user", JSON.stringify(data.user));
      toast.success(data.message);

      if (data.user.role === "doctor") {
        router.push("/doctor-dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-primary/10 p-3">
            <Activity className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900">
          Welcome to OmniCare
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to your account to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-primary/10 shadow-lg bg-white/60 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Select your role and enter your details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setRole("patient")}
                  className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                    role === "patient"
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <UserRound className="h-4 w-4" /> Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole("doctor")}
                  className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                    role === "doctor"
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Stethoscope className="h-4 w-4" /> Doctor
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2 relative">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-9 border-slate-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9 border-slate-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4 mt-2">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
