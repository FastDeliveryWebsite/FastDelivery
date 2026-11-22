"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, FolderTree, Package, LogOut, ExternalLink, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";

interface AdminSidebarProps {
  activeTab: "dashboard" | "categories" | "products";
  onTabChange: (tab: "dashboard" | "categories" | "products") => void;
  adminEmail?: string;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  adminEmail = "admin@fastdelivery.com",
  onLogout,
  isLoggingOut = false,
}) => {
  return (
    <aside className="w-full md:w-64 h-full bg-white border-r border-gray-200/90 flex flex-col justify-between shrink-0 overflow-y-auto">
      
      {/* Top Branding & Navigation */}
      <div>
        
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link href="/admin/dashboard" className="block">
            <Logo variant="dark" size="sm" />
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-brand-red px-2 py-0.5 rounded-md border border-red-100">
            Admin
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="p-4 space-y-1.5 text-left">
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Store Management
          </p>

          {/* 1. Dashboard Overview Tab */}
          <button
            type="button"
            onClick={() => onTabChange("dashboard")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-brand-red text-white shadow-xs"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === "dashboard" ? "text-white" : "text-gray-500"}`} />
            <span>Dashboard</span>
          </button>

          {/* 2. Categories Tab */}
          <button
            type="button"
            onClick={() => onTabChange("categories")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "categories"
                ? "bg-brand-red text-white shadow-xs"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <FolderTree className={`w-4 h-4 ${activeTab === "categories" ? "text-white" : "text-gray-500"}`} />
            <span>Categories</span>
          </button>

          {/* 3. Products Tab */}
          <button
            type="button"
            onClick={() => onTabChange("products")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "products"
                ? "bg-brand-red text-white shadow-xs"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Package className={`w-4 h-4 ${activeTab === "products" ? "text-white" : "text-gray-500"}`} />
            <span>Products</span>
          </button>
        </div>

      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        
        {/* Live Store Link */}
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-brand-red hover:bg-gray-50 transition-colors"
        >
          <span>View Live Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Admin Info Card */}
        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center gap-2.5 text-left">
          <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xs shrink-0">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {adminEmail}
            </p>
            <p className="text-[10px] text-gray-500 flex items-center gap-1 font-normal">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Verified Admin</span>
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-100 transition-colors cursor-pointer disabled:opacity-60"
        >
          <LogOut className="w-4 h-4" />
          <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
        </button>

      </div>

    </aside>
  );
};
