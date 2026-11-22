"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Logo } from "@/components/Logo";

export const AdminLogin: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Authentication successful! Redirecting to Dashboard...");
      
      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 600);
    } catch {
      setErrorMessage("Network error: Could not reach the authentication server.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center font-sans relative py-12 px-4 sm:px-6 lg:px-8 select-none">
      
      {/* Top Header / Brand Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 mb-6">
        <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
          <Logo variant="dark" size="lg" />
        </Link>
        
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-xs font-semibold text-brand-red">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bilariyaganj Admin Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Admin Sign In
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            Secure login for order dispatch, inventory, and store operations
          </p>
        </div>
      </div>

      {/* Main Login Card (White UI) */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-gray-200/90 shadow-sm relative space-y-5">
          
          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-brand-red text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-brand-red" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fastdelivery.com"
                  required
                  autoComplete="email"
                  className="w-full bg-gray-50/60 text-gray-900 placeholder-gray-400 text-sm font-normal rounded-xl pl-10 pr-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-gray-50/60 text-gray-900 placeholder-gray-400 text-sm font-normal rounded-xl pl-10 pr-11 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-brand-red hover:bg-brand-red-hover active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Return to store link */}
          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-brand-red transition-colors font-medium inline-flex items-center gap-1"
            >
              <span>&larr; Return to Store</span>
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
