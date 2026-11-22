"use client";

import React from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Clock, 
  ArrowUpRight, 
  FolderTree, 
  Package, 
  CheckCircle2, 
  Truck, 
  Timer,
  AlertCircle
} from "lucide-react";

interface DashboardOverviewProps {
  onNavigateTab: (tab: "categories" | "products") => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateTab }) => {
  // Hardcoded dummy data for dashboard approval demo
  const DUMMY_STATS = [
    {
      title: "Total Sales",
      value: "₹1,48,250",
      change: "+14.8%",
      isPositive: true,
      subtext: "vs last 30 days",
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Total Orders",
      value: "1,284",
      change: "+8.2%",
      isPositive: true,
      subtext: "98.4% success rate",
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Active Customers",
      value: "842",
      change: "+24 new",
      isPositive: true,
      subtext: "Bilariyaganj & nearby",
      icon: Users,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Avg Delivery Time",
      value: "18 Mins",
      change: "-3 mins",
      isPositive: true,
      subtext: "Express hyperlocal",
      icon: Clock,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  const RECENT_ORDERS = [
    {
      id: "FD-8924",
      customer: "Rahul Gupta",
      area: "Bilariyaganj Main Chowk",
      items: "Basmati Rice, Mustard Oil (2 items)",
      total: "₹340",
      status: "Delivered",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      time: "10 mins ago",
    },
    {
      id: "FD-8923",
      customer: "Priya Sharma",
      area: "Gandhi Nagar",
      items: "Fresh Milk, Malai Paneer (3 items)",
      total: "₹195",
      status: "Out for Delivery",
      statusColor: "bg-sky-50 text-sky-700 border-sky-200",
      time: "22 mins ago",
    },
    {
      id: "FD-8922",
      customer: "Amit Verma",
      area: "Station Road",
      items: "Paracetamol 650mg, ORS (2 items)",
      total: "₹92",
      status: "Processing",
      statusColor: "bg-amber-50 text-amber-700 border-amber-200",
      time: "35 mins ago",
    },
    {
      id: "FD-8921",
      customer: "Sunita Yadav",
      area: "Purwa Ward 4",
      items: "Assam Tea, Glucose Biscuits (4 items)",
      total: "₹245",
      status: "Delivered",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      time: "1 hr ago",
    },
    {
      id: "FD-8920",
      customer: "Tariq Khan",
      area: "Bilariyaganj Mandi",
      items: "Atta 5kg, Whole Spices (2 items)",
      total: "₹410",
      status: "Delivered",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      time: "2 hrs ago",
    },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Welcome & Quick Action Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-brand-red text-xs font-semibold mb-1.5">
            <span>Admin Control Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-950">
            Store Performance Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            Real-time Bilariyaganj operational metrics and recent customer order dispatches
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigateTab("categories")}
            className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <FolderTree className="w-4 h-4 text-gray-600" />
            <span>Categories</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab("products")}
            className="inline-flex items-center gap-1.5 bg-brand-red hover:bg-brand-red-hover text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>Products</span>
          </button>
        </div>
      </div>

      {/* 4 Dummy Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DUMMY_STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">
                  {stat.title}
                </span>
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1.5 pt-1 text-xs">
                  <span className="font-semibold text-emerald-600">
                    {stat.change}
                  </span>
                  <span className="text-gray-400 font-normal">
                    {stat.subtext}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dummy Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Recent Store Orders
            </h2>
            <p className="text-xs text-gray-400 font-normal">
              Sample live order feeds for review and dispatch approval
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-red bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
            Live Demo Feed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50/80 text-gray-500 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer & Area</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-normal">
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-gray-900">{order.customer}</div>
                    <div className="text-[11px] text-gray-400">{order.area}</div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 max-w-xs truncate">
                    {order.items}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-gray-900">
                    {order.total}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-gray-400 text-xs">
                    {order.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
