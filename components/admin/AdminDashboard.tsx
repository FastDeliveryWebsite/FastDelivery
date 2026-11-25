"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ShieldCheck, Database, Key } from "lucide-react";
import { AdminSidebar, AdminTab } from "./AdminSidebar";
import { DashboardOverview } from "./DashboardOverview";
import { OrderManagement } from "./orders/OrderManagement";
import { CategoryManagement } from "./categories/CategoryManagement";
import { ProductManagement } from "./products/ProductManagement";
import { ContactManagement } from "./contact/ContactManagement";
import { Logo } from "@/components/Logo";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch admin session from API
  useEffect(() => {
    async function loadAdmin() {
      try {
        const res = await fetch("/api/admin/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.admin) {
            setAdmin(data.admin);
          }
        }
      } catch {
        // Fallback
      }
    }
    loadAdmin();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Continue even on network error
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/70 font-sans text-gray-900 flex flex-col md:flex-row select-none">

      {/* Mobile Top Header (Navbar with drawer toggle) */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Logo variant="dark" size="sm" />
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Sticky Sidebar (Never scrolls away) */}
      <div className="hidden md:block sticky top-0 h-screen shrink-0 z-30">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          adminEmail={admin?.email}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      </div>

      {/* Mobile Sidebar Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10">
            <AdminSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              adminEmail={admin?.email}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">

        {/* Top Mini Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-gray-200/80">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-brand-red" />
            <span>Fast Delivery Bilariyaganj &bull; Admin Console</span>
          </div>

          {/* <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-[11px] text-gray-600 font-medium">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase DB Active</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <Key className="w-3 h-3 text-brand-red ml-1" />
            <span>JWT Secure</span>
          </div> */}
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <DashboardOverview onNavigateTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === "orders" && <OrderManagement />}
        {activeTab === "categories" && <CategoryManagement />}
        {activeTab === "products" && <ProductManagement />}
        {activeTab === "queries" && <ContactManagement />}

      </main>

    </div>
  );
};
