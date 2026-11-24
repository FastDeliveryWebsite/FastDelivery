"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from "lucide-react";

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Frontend validation
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage("Please enter your full name (at least 2 characters).");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-check.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(name.trim(), email.trim(), password);
      if (result.success) {
        setSuccessMessage("Account created successfully! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 800);
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage("Network error: Could not complete registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans select-none">

      {/* Top Header & Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-3">
        <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
          <Logo variant="dark" size="lg" />
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          Create Your Account
        </h1>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-10 px-6 sm:px-10 rounded-3xl border border-gray-200/90 shadow-2xl space-y-6">

          {/* Alerts */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-brand-red font-medium flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-medium flex items-start gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="flex-1">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">

            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Full Name <span className="text-brand-red">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Gupta"
                  required
                  disabled={isLoading}
                  className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 text-base rounded-2xl pl-12 pr-4 py-3.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all shadow-xs"
                />
                <User className="w-5 h-5 text-gray-400 absolute left-4 top-4 pointer-events-none" />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Email Address <span className="text-brand-red">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={isLoading}
                  className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 text-base rounded-2xl pl-12 pr-4 py-3.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all shadow-xs"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-4 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Password <span className="text-brand-red">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  disabled={isLoading}
                  className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 text-base rounded-2xl pl-12 pr-12 py-3.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all shadow-xs"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-4 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Confirm Password <span className="text-brand-red">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  disabled={isLoading}
                  className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 text-base rounded-2xl pl-12 pr-4 py-3.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all shadow-xs"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-4 pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-brand-red hover:bg-brand-red-hover active:scale-98 text-white font-bold text-base sm:text-lg py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="pt-5 border-t border-gray-100 text-center">
            <p className="text-sm sm:text-base text-gray-600 font-normal">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-brand-red hover:underline font-bold cursor-pointer"
              >
                Sign In
              </Link>
            </p>
          </div>

        </div>

        {/* Back to Home Link */}
        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer font-medium"
          >
            ← Back to Bilariyaganj Store
          </Link>
        </div>

      </div>

    </div>
  );
};
