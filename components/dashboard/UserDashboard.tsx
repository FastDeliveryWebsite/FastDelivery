"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Logo } from "@/components/Logo";
import { CartDrawer } from "@/components/CartDrawer";
import {
  ShoppingBag,
  ShoppingCart,
  Clock,
  Truck,
  User,
  Phone,
  MessageCircle,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Plus,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  Package,
  Store,
  Navigation,
  Save,
  Check,
  MapPin,
  ExternalLink
} from "lucide-react";

export interface PastOrderItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
}

export interface PastOrder {
  id: string;
  date: string;
  time: string;
  status: "Order Placed" | "Packed at Mandi" | "Out for Delivery" | "Delivered" | "Cancelled" | "Processing" | string;
  items: PastOrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  estimatedDelivery?: string;
  riderName?: string;
  riderPhone?: string;
}

export const UserDashboard: React.FC = () => {
  const { user, logout, updateUserProfile, refreshUser } = useAuth();
  const cart = useCart();

  // Active Tab: "orders" | "tracking" | "profile" | "support"
  const [activeTab, setActiveTab] = useState<string>("orders");

  // Profile Form States (Directly mapped to Supabase users table)
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [pincode, setPincode] = useState(user?.pincode || "276121");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Dynamic Orders State (Loaded from DB / local order history, NO hardcoded dummy data)
  const [orders, setOrders] = useState<PastOrder[]>([]);
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  // Dynamic Pagination for Customer Orders (Displays when orders are 2 or more)
  const [orderPage, setOrderPage] = useState<number>(1);
  const USER_ORDERS_PER_PAGE = 2;
  const totalUserOrderPages = Math.ceil(orders.length / USER_ORDERS_PER_PAGE);
  const userOrderStartIndex = (orderPage - 1) * USER_ORDERS_PER_PAGE;
  const userOrderEndIndex = Math.min(userOrderStartIndex + USER_ORDERS_PER_PAGE, orders.length);
  const paginatedOrders = orders.slice(userOrderStartIndex, userOrderEndIndex);

  // Load user profile & orders on mount
  useEffect(() => {
    let isMounted = true;

    const fetchLatestProfile = async () => {
      try {
        const res = await fetch("/api/user/profile", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && data.user) {
            setName(data.user.name || "");
            setPhone(data.user.phone || "");
            setAddress(data.user.address || "");
            setPincode(data.user.pincode || "276121");
          }
        }
      } catch {
        // Fallback to AuthContext state
        if (isMounted && user) {
          setName(user.name || "");
          setPhone(user.phone || "");
          setAddress(user.address || "");
          setPincode(user.pincode || "276121");
        }
      }
    };

    fetchLatestProfile();

    // Fetch dynamic orders from DB
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.orders) && data.orders.length > 0) {
            const mappedOrders: PastOrder[] = data.orders.map((o: any) => ({
              id: o.order_number || o.id,
              date: new Date(o.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              time: new Date(o.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              status: o.status || "Order Placed",
              items: Array.isArray(o.items) ? o.items : [],
              totalAmount: Number(o.total_amount),
              deliveryAddress: o.delivery_address || "",
              estimatedDelivery: o.estimated_delivery || "15–30 Mins Express Delivery",
              riderName: o.rider_name || "Bilariyaganj Express Rider",
              riderPhone: o.rider_phone || "+919876543210",
            }));

            setOrders(mappedOrders);
            return;
          }
        }
      } catch {
        // Fallback
      }

      // Check localStorage for offline / session orders
      if (user?.id && isMounted) {
        try {
          const savedOrders = localStorage.getItem(`fd_orders_${user.id}`);
          if (savedOrders) {
            const parsed = JSON.parse(savedOrders);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setOrders(parsed);
            }
          }
        } catch {
          // Ignore
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Handle Profile Update directly to DB
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg(null);
    setProfileErrorMsg(null);

    if (!name.trim()) {
      setProfileErrorMsg("Please enter your full name.");
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        pincode: pincode.trim(),
      });

      if (res.success) {
        setProfileSuccessMsg("Profile and delivery details saved to database successfully!");
        await refreshUser();
        setTimeout(() => setProfileSuccessMsg(null), 4000);
      } else {
        setProfileErrorMsg(res.message);
      }
    } catch {
      setProfileErrorMsg("Could not save profile details to database. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Re-Order 1-Click Function
  const handleReorder = (order: PastOrder) => {
    order.items.forEach((item) => {
      cart.addToCart({
        id: item.id,
        name: item.name,
        weight: item.weight,
        price: item.price,
        image: item.image,
        category: "General",
        inStock: true,
      });
    });

    setReorderedId(order.id);
    cart.showToast(`Re-ordered ${order.items.length} items from #${order.id} into cart!`);
    setTimeout(() => {
      setReorderedId(null);
    }, 2500);
  };

  // Navigation Tabs Definition (Clean 3 Core Tabs)
  interface NavTabItem {
    id: string;
    label: string;
    icon: any;
    badge?: string;
    highlight?: boolean;
  }

  const NAV_TABS: NavTabItem[] = [
    {
      id: "orders",
      label: "My Orders",
      icon: ShoppingBag,
      badge: orders.length > 0 ? `${orders.length}` : undefined,
    },
    {
      id: "profile",
      label: "My Profile & Address",
      icon: User,
    },
    {
      id: "support",
      label: "Customer Support",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/70 font-sans text-gray-900 flex flex-col select-none">

      {/* Top Navbar Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3.5 sticky top-0 z-40 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo variant="dark" size="sm" />
          </Link>
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-gray-200 text-xs text-gray-500 font-medium">
            <span>Customer Portal</span>
            <span className="text-gray-300">&bull;</span>
            <span className="text-brand-red font-semibold">Bilariyaganj Express</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/category"
            className="inline-flex items-center gap-1.5 bg-[#fdd602] hover:bg-[#FFE600] active:scale-95 text-gray-950 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-gray-900" />
            <span>Go to Shop</span>
          </Link>

          {/* Cart Icon & Sidebar Drawer Button */}
          <button
            type="button"
            onClick={cart.openCart}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 transition-all cursor-pointer"
            title="Open Cart"
            aria-label="Open Cart"
          >
            <ShoppingCart className="w-5 h-5 text-gray-800" />
            {cart.cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {cart.cartCount}
              </span>
            )}
          </button>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[120px]">
                {user?.name || "Customer"}
              </p>
              <p className="text-[10px] text-gray-500 truncate max-w-[120px]">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Body with Left Mini Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">

        {/* ========================================================================= */}
        {/* LEFT MINI SIDEBAR                                                        */}
        {/* ========================================================================= */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-3">

          {/* User Quick Info Card */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-gray-950 truncate">
                {user?.name || "Customer"}
              </h2>
              <p className="text-xs text-gray-500 truncate">
                {phone || user?.email || "Bilariyaganj"}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Account</span>
              </span>
            </div>
          </div>

          {/* Sidebar Navigation Tabs */}
          <div className="bg-white p-2 sm:p-2.5 rounded-3xl border border-gray-200 shadow-xs space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Dashboard Menu
            </div>

            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${isActive
                    ? "bg-[#fdd602] text-gray-950 shadow-xs"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-950"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-gray-950 stroke-[2.5]" : "text-gray-500"}`} />
                    <span>{tab.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {tab.highlight && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    )}
                    {tab.badge && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isActive
                          ? "bg-gray-950 text-white"
                          : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
              <Link
                href="/category"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors cursor-pointer"
              >
                <Store className="w-4 h-4 text-gray-400" />
                <span>Explore Store</span>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm text-brand-red hover:bg-red-50 font-semibold transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Bilariyaganj WhatsApp Hotline Card */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50/80 p-4 rounded-3xl border border-yellow-200/70 text-left space-y-2">
            <div className="flex items-center gap-2 text-yellow-900 font-bold text-xs">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Coordinator</span>
            </div>
            <p className="text-[11px] text-yellow-800 leading-relaxed font-normal">
              Need immediate help with your delivery or custom Mandi order?
            </p>
            <a
              href="https://wa.me/919876543210?text=Hi%20Fast%20Delivery%20Bilariyaganj%2C%20I%20need%20assistance%20with%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-950 bg-[#fdd602] hover:bg-yellow-400 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <span>Chat on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* RIGHT MAIN CONTENT AREA                                                   */}
        {/* ========================================================================= */}
        <main className="flex-1 min-w-0 space-y-6 text-left">

          {/* TAB 1: MY ORDERS (DYNAMIC, ZERO DUMMY DATA) */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-950">
                    My Orders & Order History
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 font-normal">
                    Review your placed grocery orders and track live statuses
                  </p>
                </div>
                <Link
                  href="/category"
                  className="inline-flex items-center gap-2 bg-[#fdd602] hover:bg-yellow-400 text-gray-950 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start New Order</span>
                </Link>
              </div>

              {orders.length === 0 ? (
                /* Clean Empty State when user has no orders */
                <div className="bg-white rounded-3xl border border-gray-200/90 p-12 sm:p-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto shadow-inner">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      No Orders Placed Yet
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
                      You haven&apos;t placed any grocery orders yet. Fresh mandis essentials, dairy, vegetables, and daily items are arriving daily in Bilariyaganj!
                    </p>
                  </div>
                  <Link
                    href="/category"
                    className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover active:scale-95 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-2xl shadow-sm transition-all cursor-pointer"
                  >
                    <span>Browse & Order Essentials</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                /* Dynamic Orders List */
                <div className="space-y-4">
                  {paginatedOrders.map((order) => {
                    const isOutForDelivery = order.status === "Out for Delivery";
                    const isDelivered = order.status === "Delivered";

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden transition-all hover:border-gray-300"
                      >
                        {/* Order Card Header */}
                        <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm sm:text-base font-extrabold text-gray-950">
                                Order #{order.id}
                              </span>
                              <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${isOutForDelivery
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : isDelivered
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                  }`}
                              >
                                {isOutForDelivery && (
                                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                                )}
                                <span>{order.status}</span>
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-normal">
                              Placed on {order.date} at {order.time} &bull; Bilariyaganj Local Hub
                            </p>
                          </div>

                          {/* Re-Order 1-Click Button */}
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleReorder(order)}
                              className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover active:scale-95 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                            >
                              {reorderedId === order.id ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>Added to Cart!</span>
                                </>
                              ) : (
                                <>
                                  <RotateCcw className="w-4 h-4" />
                                  <span>Re-order</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Items List Inside Order */}
                        <div className="p-5 sm:p-6 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3"
                              >
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-200">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-bold text-gray-900 truncate">
                                    {item.name}
                                  </h4>
                                  <p className="text-[11px] text-gray-500">
                                    {item.weight} &bull; Qty: {item.quantity}
                                  </p>
                                  <p className="text-xs font-bold text-gray-900">
                                    ₹{item.price * item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Integrated Live Tracking Progress Bar inside Order Card */}
                          <div className="pt-3 border-t border-gray-100 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 font-bold text-gray-900">
                                <Truck className="w-4 h-4 text-brand-red" />
                                <span>Order Delivery Status: {order.status}</span>
                              </div>
                              <span className="text-[11px] text-gray-500 font-medium">
                                {order.status === "Delivered"
                                  ? "Delivered to Doorstep"
                                  : order.estimatedDelivery || "15–30 Mins Express Delivery"}
                              </span>
                            </div>

                            {/* 4-Step Progress Flow (Admin updates status from dashboard) */}
                            {order.status === "Cancelled" ? (
                              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold text-center flex items-center justify-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <span>Order has been cancelled by store administrator.</span>
                              </div>
                            ) : (
                              <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                                <div
                                  className={`p-2 rounded-xl flex flex-col items-center gap-1 ${
                                    ["Order Placed", "Packed at Mandi", "Out for Delivery", "Delivered", "Processing"].includes(order.status)
                                      ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>1. Placed</span>
                                </div>

                                <div
                                  className={`p-2 rounded-xl flex flex-col items-center gap-1 ${
                                    ["Packed at Mandi", "Out for Delivery", "Delivered"].includes(order.status)
                                      ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  {["Packed at Mandi", "Out for Delivery", "Delivered"].includes(order.status) ? (
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  ) : (
                                    <Clock className="w-3.5 h-3.5" />
                                  )}
                                  <span>2. Packed</span>
                                </div>

                                <div
                                  className={`p-2 rounded-xl flex flex-col items-center gap-1 ${
                                    order.status === "Out for Delivery"
                                      ? "bg-yellow-100 text-yellow-950 font-extrabold border-2 border-[#fdd602] shadow-xs animate-pulse"
                                      : order.status === "Delivered"
                                        ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                                        : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  <Truck className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>3. On The Way</span>
                                </div>

                                <div
                                  className={`p-2 rounded-xl flex flex-col items-center gap-1 ${
                                    order.status === "Delivered"
                                      ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                                      : "bg-gray-100 text-gray-400 opacity-60"
                                  }`}
                                >
                                  {order.status === "Delivered" ? (
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  ) : (
                                    <Package className="w-3.5 h-3.5" />
                                  )}
                                  <span>4. Delivered</span>
                                </div>
                              </div>
                            )}

                            {/* Rider info if out for delivery */}
                            {order.status === "Out for Delivery" && order.riderName && (
                              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-center justify-between text-xs text-blue-900 mt-2">
                                <span className="font-semibold">Rider: {order.riderName}</span>
                                {order.riderPhone && (
                                  <a
                                    href={`tel:${order.riderPhone}`}
                                    className="font-bold text-brand-red hover:underline flex items-center gap-1"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>Call Rider</span>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Summary Bar */}
                          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                              <span className="truncate max-w-md">{order.deliveryAddress}</span>
                            </div>
                            <div className="text-right">
                              <span>Total Paid: </span>
                              <span className="text-sm font-extrabold text-gray-950">
                                ₹{order.totalAmount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Dynamic Orders Pagination Controls (Displays when orders are 2 or more) */}
                  {totalUserOrderPages > 1 && (
                    <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mt-4">
                      <p className="text-gray-500 font-medium">
                        Showing <span className="font-bold text-gray-900">{userOrderStartIndex + 1}</span> to{" "}
                        <span className="font-bold text-gray-900">{userOrderEndIndex}</span> of{" "}
                        <span className="font-bold text-gray-900">{orders.length}</span> orders
                      </p>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                          disabled={orderPage === 1}
                          className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-gray-700 flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Prev</span>
                        </button>

                        {Array.from({ length: totalUserOrderPages }, (_, idx) => idx + 1).map((pg) => (
                          <button
                            key={pg}
                            type="button"
                            onClick={() => setOrderPage(pg)}
                            className={`w-8 h-8 rounded-xl font-bold transition-all cursor-pointer ${
                              orderPage === pg
                                ? "bg-brand-red text-white shadow-xs"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {pg}
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => setOrderPage((p) => Math.min(totalUserOrderPages, p + 1))}
                          disabled={orderPage === totalUserOrderPages}
                          className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-gray-700 flex items-center gap-1 transition-all cursor-pointer"
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
          )}

          {/* TAB 2: MY PROFILE & DELIVERY DETAILS (PERSISTED IN SUPABASE USERS TABLE) */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-950">
                    My Profile & Delivery Details
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 font-normal">
                    Update your delivery address, mobile number, and personal details stored directly in the database
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold self-start sm:self-auto border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Database Account</span>
                </span>
              </div>

              {/* Profile Form Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">

                {/* Alerts */}
                {profileSuccessMsg && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-700 font-semibold flex items-center gap-2.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                {profileErrorMsg && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-brand-red font-semibold flex items-center gap-2.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{profileErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700">
                        Full Name <span className="text-brand-red">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Gupta"
                        className="w-full bg-gray-50 text-gray-900 text-sm rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all font-medium"
                      />
                    </div>

                    {/* Email Address (Registered) */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700">
                        Email Address (Registered Login)
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        className="w-full bg-gray-100 text-gray-500 text-sm rounded-xl px-4 py-3 border border-gray-200 cursor-not-allowed font-medium"
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700">
                        Mobile Number (For Delivery Confirmation & Rider Calling)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-gray-50 text-gray-900 text-sm rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all font-medium"
                      />
                    </div>

                    {/* Pincode */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="276121"
                        className="w-full bg-gray-50 text-gray-900 text-sm rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Complete Delivery Address (House / Shop / Mohalla / Landmark)
                    </label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Ward 04, Near Bilal Masjid, Main Chowk, Bilariyaganj, Azamgarh - 276121"
                      className="w-full bg-gray-50 text-gray-900 text-sm rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all font-medium"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover active:scale-95 text-white text-sm font-bold px-6 py-3.5 rounded-2xl shadow-sm transition-all cursor-pointer disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingProfile ? "Saving to Database..." : "Save & Update Profile Details"}</span>
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER SUPPORT & WHATSAPP */}
          {activeTab === "support" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-[#25D366] text-xs font-bold">
                  <MessageCircle className="w-4 h-4" />
                  <span>Bilariyaganj Local Support Desk</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
                  Customer Support & WhatsApp Help
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 font-normal max-w-xl">
                  Connect instantly with our Bilariyaganj delivery coordinator for order inquiries, delivery status, or custom requests.
                </p>
              </div>

              {/* Direct Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* 1-Tap WhatsApp Button */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#25D366] flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-950">Instant WhatsApp Chat</h3>
                    <p className="text-xs text-gray-500 font-normal mt-1 leading-relaxed">
                      Chat directly with our Mandi delivery manager. Send screenshots, audio notes, or custom grocery lists.
                    </p>
                  </div>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20Fast%20Delivery%20Bilariyaganj%2C%20I%20have%20a%20question%20about%20my%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm py-3 px-4 rounded-2xl shadow-sm transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>

                {/* Direct Phone Call */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center">
                    <Phone className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-950">Direct Phone Assistance</h3>
                    <p className="text-xs text-gray-500 font-normal mt-1 leading-relaxed">
                      Speak directly with our local dispatcher for immediate delivery status or rider coordination.
                    </p>
                  </div>
                  <a
                    href="tel:+919876543210"
                    className="inline-flex items-center justify-center gap-2 w-full bg-brand-red hover:bg-brand-red-hover text-white font-bold text-sm py-3 px-4 rounded-2xl shadow-sm transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Coordinator</span>
                  </a>
                </div>

              </div>

              {/* Local Hub Information */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3 text-xs text-gray-600">
                <h4 className="font-bold text-sm text-gray-950">Bilariyaganj Delivery Hub Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="font-semibold text-gray-900">Hub Location</p>
                    <p className="text-gray-500 mt-0.5">Main Chowk, Bilariyaganj, Azamgarh (UP) - 276121</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="font-semibold text-gray-900">Delivery Timings</p>
                    <p className="text-gray-500 mt-0.5">06:00 AM – 10:00 PM (All 7 Days)</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="font-semibold text-gray-900">Average Delivery Speed</p>
                    <p className="text-gray-500 mt-0.5">15–30 Minutes to your Doorstep</p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
        Fast Delivery &bull; Hyperlocal Grocery Service in Bilariyaganj &bull; Azamgarh, UP
      </footer>

      {/* Cart Drawer Sidebar */}
      <CartDrawer />

    </div>
  );
};
