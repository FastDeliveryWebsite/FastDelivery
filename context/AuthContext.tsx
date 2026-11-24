"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserJWTPayload } from "@/lib/auth";
import { Lock, ShoppingBag, X, ArrowRight, UserPlus, LogIn } from "lucide-react";
import Link from "next/link";

interface AuthContextType {
  user: UserJWTPayload | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserProfile: (data: { name: string; phone?: string; address?: string; pincode?: string }) => Promise<{ success: boolean; message: string; user?: any }>;
  isAuthPromptOpen: boolean;
  authPromptMessage: string;
  openAuthPrompt: (message?: string) => void;
  closeAuthPrompt: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserJWTPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState(
    "Please register or log in first to start shopping and add items to your cart."
  );

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      setUser(data.user);
      setIsAuthPromptOpen(false);
      return { success: true, message: data.message };
    }
    return { success: false, message: data.message || "Login failed." };
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      setUser(data.user);
      setIsAuthPromptOpen(false);
      return { success: true, message: data.message };
    }
    return { success: false, message: data.message || "Registration failed." };
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continue anyway
    } finally {
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  };

  const updateUserProfile = async (profileData: {
    name: string;
    phone?: string;
    address?: string;
    pincode?: string;
  }) => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        return { success: true, message: data.message || "Profile updated!", user: data.user };
      }
      return { success: false, message: data.message || "Failed to update profile." };
    } catch {
      return { success: false, message: "Network error updating profile." };
    }
  };

  const openAuthPrompt = (message?: string) => {
    if (message) setAuthPromptMessage(message);
    setIsAuthPromptOpen(true);
  };

  const closeAuthPrompt = () => {
    setIsAuthPromptOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateUserProfile,
        isAuthPromptOpen,
        authPromptMessage,
        openAuthPrompt,
        closeAuthPrompt,
      }}
    >
      {children}

      {/* Global Shopping Auth Required Modal */}
      {isAuthPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6 relative text-center">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={closeAuthPrompt}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon Header */}
            <div className="w-16 h-16 rounded-3xl bg-red-50 text-brand-red flex items-center justify-center mx-auto border border-red-100 shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Account Required to Shop
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed">
                {authPromptMessage}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <Link
                href="/login"
                onClick={closeAuthPrompt}
                className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-hover active:scale-95 text-white text-sm font-semibold py-3 px-4 rounded-2xl shadow-sm transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In to Your Account</span>
              </Link>

              <Link
                href="/register"
                onClick={closeAuthPrompt}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-800 text-sm font-semibold py-3 px-4 rounded-2xl transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create a New Account</span>
              </Link>
            </div>

            {/* Footer Notice */}
            <p className="text-[11px] text-gray-400 font-normal">
              ⚡ Fast 15–30 minute grocery delivery across Bilariyaganj
            </p>

          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
