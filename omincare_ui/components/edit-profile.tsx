"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Check, AlertCircle } from "lucide-react";

interface EditProfileProps {
  onNavigate: (page: string) => void;
  onProfileUpdate?: (updatedUser: any) => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  profilePic: string;
}

type SaveStatus = "idle" | "loading" | "success" | "error";

export function EditProfile({ onNavigate, onProfileUpdate }: EditProfileProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "O+",
    profilePic: "",
  });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  // Pre-fill form with current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userStr = localStorage.getItem("omnicare_user") || localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const userId = user?._id;
        
        const url = userId 
          ? `https://omnicare-6244.onrender.com/api/profile?userId=${userId}`
          : "https://omnicare-6244.onrender.com/api/profile";

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setForm({
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          bloodGroup: data.bloodGroup ?? "O+",
          profilePic: data.profilePic ?? data.image ?? "",
        });
      } catch {
        // silently fall back to empty defaults
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (saveStatus !== "idle") setSaveStatus("idle");
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setSaveStatus("error");
      setErrorMsg("Name and email are required.");
      return;
    }
    setSaveStatus("loading");
    setErrorMsg(null);
    try {
      const userStr = localStorage.getItem("omnicare_user") || localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?._id;

      const res = await fetch("https://omnicare-6244.onrender.com/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      // Update local storage immediately with the new user details so changes reflect instantly
      if (user) {
        const updatedUser = {
          ...user,
          name: form.name,
          email: form.email,
          phone: form.phone,
          bloodGroup: form.bloodGroup,
          profilePic: form.profilePic,
        };
        localStorage.setItem("omnicare_user", JSON.stringify(updatedUser));
        if (localStorage.getItem("user")) {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        // Notify parent component about the updated profile details so state changes instantly
        if (onProfileUpdate) {
          onProfileUpdate(updatedUser);
        }
      }

      setSaveStatus("success");
      // Reset back to idle after 2.5s
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err: any) {
      setSaveStatus("error");
      setErrorMsg(err.message || "Something went wrong.");
    }
  };

  return (
    <section className="py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => onNavigate("profile")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Profile
        </button>

        <h2 className="text-2xl font-bold text-foreground mb-6">Edit Profile</h2>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <img
              src={form.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || "User")}&background=0D8ABC&color=fff&size=200`}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
            />
            <input
              type="file"
              accept="image/*"
              id="profile-pic-upload"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 1024 * 1024) {
                    alert("Please select an image smaller than 1MB.");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setForm(prev => ({ ...prev, profilePic: base64String }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <label
              htmlFor="profile-pic-upload"
              className="px-4 py-2 text-sm rounded-xl border border-border hover:bg-accent transition-colors font-medium cursor-pointer bg-card border-slate-200 text-slate-700 inline-block"
            >
              Change Photo
            </label>
          </div>

          {/* Skeleton while loading */}
          {isFetching ? (
            <div className="space-y-4 animate-pulse">
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-10 bg-slate-100 rounded-xl" />
                  </div>
                ))}
              </div>
              <div className="h-10 bg-slate-200 rounded-xl" />
            </div>
          ) : (
            <>
              {/* Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                  <input
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="+1 (555) 123-4567"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Blood Group</label>
                  <select
                    value={form.bloodGroup}
                    onChange={handleChange("bloodGroup")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Feedback */}
              {saveStatus === "error" && errorMsg && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}
              {saveStatus === "success" && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  Profile updated successfully!
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saveStatus === "loading"}
                className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saveStatus === "loading" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                ) : saveStatus === "success" ? (
                  <><Check className="h-4 w-4" /> Saved!</>
                ) : (
                  "Save Changes"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
