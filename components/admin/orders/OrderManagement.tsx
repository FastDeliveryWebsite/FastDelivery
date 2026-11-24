"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  XCircle,
  PackageCheck,
  User,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
} from "lucide-react";

export interface OrderItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  delivery_address: string;
  landmark?: string;
  pincode: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: string;
  status: "Order Placed" | "Packed at Mandi" | "Out for Delivery" | "Delivered" | "Cancelled";
  rider_name?: string;
  rider_phone?: string;
  created_at: string;
  updated_at: string;
}

const STATUS_OPTIONS: Array<AdminOrder["status"]> = [
  "Order Placed",
  "Packed at Mandi",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);

  // Accordion state: by default collapsed, toggle opens all details
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Dynamic Pagination State (When order is 2 or more, pagination displays)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ORDERS_PER_PAGE = 2;

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      }
    } catch (err: any) {
      console.error("Failed to load admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Status handler
  const handleStatusChange = async (orderId: string, newStatus: AdminOrder["status"]) => {
    setUpdatingOrderId(orderId);
    setActionSuccessMsg(null);
    setActionErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Update state locally
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId || o.order_number === orderId ? { ...o, status: newStatus } : o))
        );
        setActionSuccessMsg(`Order updated to "${newStatus}"!`);
        setTimeout(() => setActionSuccessMsg(null), 3000);
      } else {
        setActionErrorMsg(data.message || "Failed to update order status.");
      }
    } catch {
      setActionErrorMsg("Network error updating order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.delivery_address?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === "ALL" || order.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Reset to page 1 whenever search query or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = Math.min(startIndex + ORDERS_PER_PAGE, filteredOrders.length);
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Analytics Stats
  const totalCount = orders.length;
  const placedCount = orders.filter((o) => o.status === "Order Placed").length;
  const packedCount = orders.filter((o) => o.status === "Packed at Mandi").length;
  const outCount = orders.filter((o) => o.status === "Out for Delivery").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const getStatusBadge = (status: AdminOrder["status"]) => {
    switch (status) {
      case "Order Placed":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Packed at Mandi":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Out for Delivery":
        return "bg-purple-50 text-purple-800 border-purple-200 animate-pulse";
      case "Delivered":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Cancelled":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner / Heading */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-red text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                Order Management & Dispatch
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal">
                Bilariyaganj Local Grocery Orders &bull; Real-time status updates to customers
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-brand-red" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Global Toast Alerts */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {actionErrorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{actionErrorMsg}</span>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Orders</p>
          <p className="text-2xl font-black text-gray-950 mt-1">{totalCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/90 bg-amber-50/20 shadow-xs">
          <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Placed</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{placedCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200/90 bg-blue-50/20 shadow-xs">
          <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Packed</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{packedCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-200/90 bg-purple-50/20 shadow-xs">
          <p className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">Out for Delivery</p>
          <p className="text-2xl font-black text-purple-700 mt-1">{outCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/90 bg-emerald-50/20 shadow-xs">
          <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Delivered</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{deliveredCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Value</p>
          <p className="text-2xl font-black text-brand-red mt-1">₹{totalRevenue}</p>
        </div>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, customer name, phone, or address..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-hidden focus:border-brand-red transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setSelectedStatusFilter("ALL")}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedStatusFilter === "ALL"
                ? "bg-brand-red text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({totalCount})
          </button>
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatusFilter === st
                  ? "bg-brand-red text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List View */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-red animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-700">Loading orders from Supabase...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">No Orders Found</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            {searchQuery
              ? `No orders matching "${searchQuery}". Clear your search or change the status filter.`
              : "No customer orders have been placed in Bilariyaganj yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentOrders.map((order) => {
            const isUpdating = updatingOrderId === order.id;
            const isExpanded = !!expandedOrders[order.id];

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden transition-all hover:border-gray-300"
              >
                {/* Order Header (Always visible - contains Order ID, status, customer info summary, and dropdown toggle button) */}
                <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-gray-50/40">
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <span className="text-base sm:text-lg font-black text-gray-950">
                      Order #{order.order_number || order.id}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {new Date(order.created_at).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="hidden md:inline-block text-xs font-semibold text-gray-300">
                      &bull;
                    </span>
                    <span className="text-xs font-bold text-gray-700 hidden sm:inline">
                      {order.customer_name}
                    </span>
                    <span className="text-xs font-black text-brand-red">
                      ₹{order.total_amount}
                    </span>
                  </div>

                  {/* Actions: Quick Status Select + Dropdown Accordion Toggle Button */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-600 hidden sm:inline">Update Status:</span>
                    <div className="relative">
                      <select
                        value={order.status}
                        disabled={isUpdating}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as AdminOrder["status"])
                        }
                        className="appearance-none bg-white border border-gray-300 text-gray-900 font-bold text-xs py-2 pl-3 pr-8 rounded-xl focus:outline-hidden focus:border-brand-red cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {isUpdating && <Loader2 className="w-4 h-4 text-brand-red animate-spin" />}

                    {/* Dropdown Icon Button: Toggles all order information on click */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(order.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isExpanded
                          ? "bg-brand-red text-white border-brand-red shadow-xs"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }`}
                      title={isExpanded ? "Hide Details" : "View Order Information"}
                      aria-label="Toggle Order Details"
                    >
                      <span className="hidden xs:inline">{isExpanded ? "Close" : "Details"}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Collapsible Order Information (Customer details, ordered items, quick advance buttons) */}
                {isExpanded && (
                  <div className="border-t border-gray-100 animate-fadeIn">
                    {/* Body: Customer Details & Order Items */}
                    <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left Column: Customer Information (5 Cols) */}
                      <div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-gray-100 pb-5 lg:pb-0 lg:pr-6">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                          <User className="w-4 h-4 text-brand-red" />
                          <span>Customer & Delivery Details</span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <p className="text-[11px] text-gray-400 font-semibold uppercase">Customer Name</p>
                            <p className="text-sm font-extrabold text-gray-950 mt-0.5">
                              {order.customer_name}
                            </p>
                          </div>

                          {order.customer_email && (
                            <div>
                              <p className="text-[11px] text-gray-400 font-semibold uppercase">Email</p>
                              <p className="text-gray-700 mt-0.5 font-medium">{order.customer_email}</p>
                            </div>
                          )}

                          <div>
                            <p className="text-[11px] text-gray-400 font-semibold uppercase">Contact Phone</p>
                            <div className="flex items-center gap-3 mt-1">
                              <a
                                href={`tel:${order.customer_phone}`}
                                className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>{order.customer_phone}</span>
                              </a>
                              <a
                                href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold px-2.5 py-1.5 rounded-lg transition-colors text-[11px]"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>

                          <div>
                            <p className="text-[11px] text-gray-400 font-semibold uppercase">Delivery Address</p>
                            <div className="flex items-start gap-1.5 mt-1 text-gray-800 font-semibold leading-relaxed">
                              <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                              <span>
                                {order.delivery_address}
                                {order.landmark && ` (Landmark: ${order.landmark})`} &bull; Pincode: {order.pincode}
                              </span>
                            </div>
                          </div>

                          {order.notes && (
                            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                                Customer Instructions:
                              </p>
                              <p className="text-xs font-normal mt-0.5">{order.notes}</p>
                            </div>
                          )}

                          <div className="pt-2">
                            <span className="text-[11px] font-bold text-gray-500">Payment Mode: </span>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                              {order.payment_method || "Cash on Delivery"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Ordered Items & Total (7 Cols) */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                          <div className="flex items-center gap-2">
                            <PackageCheck className="w-4 h-4 text-brand-red" />
                            <span>Ordered Items ({order.items?.length || 0})</span>
                          </div>
                          <span className="text-brand-red font-black text-sm">
                            Total: ₹{order.total_amount}
                          </span>
                        </div>

                        {/* Items Grid */}
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {Array.isArray(order.items) &&
                            order.items.map((item, idx) => (
                              <div
                                key={item.id || idx}
                                className="p-2.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-200">
                                    <Image
                                      src={item.image || "/images/placeholder.png"}
                                      alt={item.name}
                                      fill
                                      unoptimized
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-gray-900 truncate">{item.name}</p>
                                    <p className="text-[11px] text-gray-500">
                                      {item.weight} &bull; Qty: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-extrabold text-gray-950">
                                    ₹{item.price * item.quantity}
                                  </p>
                                  <p className="text-[10px] text-gray-400">₹{item.price}/unit</p>
                                </div>
                              </div>
                            ))}
                        </div>

                        {/* Price Summary footer */}
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                          <span className="text-gray-500 font-medium">Product Price (No extra charges)</span>
                          <span className="text-base font-black text-brand-red">
                            ₹{order.total_amount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Quick Status Buttons */}
                    <div className="px-5 py-3.5 bg-gray-50/70 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <Truck className="w-3.5 h-3.5 text-brand-red" />
                        <span>Quick Status Advance:</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {order.status !== "Packed at Mandi" && order.status !== "Out for Delivery" && order.status !== "Delivered" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, "Packed at Mandi")}
                            disabled={isUpdating}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-100 hover:bg-blue-200 text-blue-900 transition-colors cursor-pointer"
                          >
                            &rarr; Mark Packed
                          </button>
                        )}

                        {order.status !== "Out for Delivery" && order.status !== "Delivered" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, "Out for Delivery")}
                            disabled={isUpdating}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 transition-colors cursor-pointer"
                          >
                            &rarr; Out for Delivery
                          </button>
                        )}

                        {order.status !== "Delivered" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, "Delivered")}
                            disabled={isUpdating}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                          >
                            ✓ Mark Delivered
                          </button>
                        )}

                        {order.status !== "Cancelled" && order.status !== "Delivered" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, "Cancelled")}
                            disabled={isUpdating}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 hover:bg-red-200 text-red-900 transition-colors cursor-pointer"
                          >
                            ✕ Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })}

          {/* Dynamic Pagination Controls (Displays when orders are 2 or more) */}
          {totalPages > 1 && (
            <div className="bg-white p-4 rounded-3xl border border-gray-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mt-4">
              <p className="text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-gray-900">{endIndex}</span> of{" "}
                <span className="font-bold text-gray-900">{filteredOrders.length}</span> orders
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-gray-700 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-xl font-bold transition-all cursor-pointer ${
                      currentPage === pg
                        ? "bg-brand-red text-white shadow-xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-gray-700 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
