"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Logo } from "@/components/Logo";
import {
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  CreditCard,
  Banknote,
  Loader2,
  Clock,
  Sparkles,
  ChevronLeft
} from "lucide-react";

export const CheckoutForm: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, openAuthPrompt } = useAuth();
  const cart = useCart();

  // Delivery & Contact Fields
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState(user?.pincode || "276121");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  // Payment Method: "cod" | "online"
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [onlineNotice, setOnlineNotice] = useState<string | null>(null);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  // Sync profile details if available
  useEffect(() => {
    if (user) {
      if (user.name && !customerName) setCustomerName(user.name);
      if (user.phone && !customerPhone) setCustomerPhone(user.phone);
      if (user.address && !deliveryAddress) setDeliveryAddress(user.address);
      if (user.pincode && !pincode) setPincode(user.pincode);
    }
  }, [user]);

  // Order Totals Math (Pure product price only)
  const subtotal = cart.cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = 0;
  const totalAmount = subtotal;

  const handleOnlinePaymentClick = () => {
    setPaymentMethod("online");
    setOnlineNotice(
      "Coming Soon! Please select Cash on Delivery to place your order."
    );
  };

  const handleCodClick = () => {
    setPaymentMethod("cod");
    setOnlineNotice(null);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isAuthenticated) {
      openAuthPrompt("Please register or log in first to confirm and place your order.");
      return;
    }

    if (cart.cartItems.length === 0) {
      setErrorMessage("Your shopping cart is empty. Please add items to proceed.");
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number for delivery coordination.");
      return;
    }

    if (!deliveryAddress.trim()) {
      setErrorMessage("Please enter your complete delivery address in Bilariyaganj.");
      return;
    }

    if (paymentMethod === "online") {
      setErrorMessage("Online payment is currently under setup. Please select Cash on Delivery to place your order.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer_name: customerName.trim(),
        customer_email: user?.email || "customer@fastdelivery.in",
        customer_phone: customerPhone.trim(),
        delivery_address: deliveryAddress.trim(),
        landmark: landmark.trim() || null,
        pincode: pincode.trim() || "276121",
        notes: deliveryNotes.trim() || null,
        items: cart.cartItems,
        payment_method: "Cash on Delivery",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Save order locally for user dashboard instant display
        const createdOrder = data.order || {
          id: `FD-${Math.floor(10000 + Math.random() * 90000)}`,
          date: "Today",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "Order Placed",
          items: cart.cartItems.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            weight: i.product.weight,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.image,
          })),
          totalAmount,
          deliveryAddress: deliveryAddress.trim(),
        };

        if (user?.id) {
          try {
            const existingRaw = localStorage.getItem(`fd_orders_${user.id}`);
            const existing = existingRaw ? JSON.parse(existingRaw) : [];
            localStorage.setItem(
              `fd_orders_${user.id}`,
              JSON.stringify([createdOrder, ...existing])
            );
          } catch {
            // Ignore storage warning
          }
        }

        // Clear cart
        cart.orderSuccess();
        setPlacedOrder(createdOrder);
      } else {
        setErrorMessage(data.message || "Failed to place order. Please try again.");
      }
    } catch {
      setErrorMessage("Network error: Could not submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (placedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
        <div className="bg-white max-w-lg w-full rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-10 text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Order Confirmed &bull; Bilariyaganj Express
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-normal">
              Order <strong className="text-gray-900 font-bold">#{placedOrder.order_number || placedOrder.id}</strong> has been received and sent to Bilariyaganj Mandi for packing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-left space-y-2 text-xs">
            <div className="flex justify-between font-semibold text-gray-700">
              <span>Delivery Time:</span>
              <span className="text-brand-red font-bold">15–30 Minutes</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-700">
              <span>Payment Mode:</span>
              <span className="text-gray-900">Cash on Delivery (Pay at Doorstep)</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-700">
              <span>Total Payable:</span>
              <span className="text-sm font-extrabold text-gray-950">₹{placedOrder.total_amount || totalAmount}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 text-gray-500">
              <span>Delivering to: </span>
              <strong className="text-gray-800">{placedOrder.delivery_address || deliveryAddress}</strong>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-hover active:scale-98 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-sm transition-all cursor-pointer"
            >
              <span>View Order in Dashboard & Track Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/category"
              className="w-full inline-flex items-center justify-center text-xs font-semibold text-gray-500 hover:text-gray-800 py-2 transition-colors cursor-pointer"
            >
              ← Back to Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // LOADING / HYDRATING CART STATE FROM STORAGE
  if (!cart.isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
          <p className="text-xs font-semibold text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // EMPTY CART SCREEN
  if (cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
        <div className="bg-white max-w-md w-full rounded-3xl border border-gray-200 shadow-sm p-8 sm:p-10 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-950">Your Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-normal">
              You haven&apos;t added any grocery items to your cart yet. Explore our fresh mandi catalog!
            </p>
          </div>
          <Link
            href="/category"
            className="inline-flex items-center gap-2 bg-[#fdd602] hover:bg-yellow-400 text-gray-950 text-xs sm:text-sm font-bold px-6 py-3.5 rounded-2xl shadow-xs transition-all cursor-pointer"
          >
            <span>Explore Bilariyaganj Store</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 font-sans text-gray-900 select-none pb-16">

      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <Logo variant="dark" size="sm" />
            </Link>
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200 text-xs text-gray-500 font-medium">
              <span>Secure Checkout</span>
              <span className="text-gray-300">&bull;</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>15–30 Min Doorstep Delivery</span>
              </span>
            </div>
          </div>

          <Link
            href="/category"
            className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </header>

      {/* Main Checkout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Page Title */}
        <div className="mb-6 space-y-1 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
            Checkout & Order Confirmation
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            Enter your Bilariyaganj delivery address and confirm payment method
          </p>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-brand-red font-semibold flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Customer & Delivery Details Form (8 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">

            <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-6">

              {/* Card 1: Delivery Address */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-5">
                <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-brand-red flex items-center justify-center">
                    <MapPin className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-950">
                      1. Delivery Address & Contact
                    </h2>
                    <p className="text-xs text-gray-500 font-normal">
                      Where should our delivery boy bring your order?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Full Name <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Gupta"
                      className="w-full bg-gray-50 text-gray-900 text-sm rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] font-medium"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Mobile Number (For Rider Call) <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-gray-50 text-gray-900 text-sm rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] font-medium"
                    />
                  </div>
                </div>

                {/* Complete Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    House / Shop / Street / Mohalla Address <span className="text-brand-red">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. Ward 04, Main Chowk, Bilariyaganj"
                    className="w-full bg-gray-50 text-gray-900 text-sm rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Landmark */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Specific Landmark (Crucial for Rider)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Opposite Bilal Masjid / State Bank"
                      className="w-full bg-gray-50 text-gray-900 text-sm rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] font-medium"
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
                      className="w-full bg-gray-50 text-gray-900 text-sm rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] font-medium"
                    />
                  </div>
                </div>

                {/* Optional Instructions */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    Special Delivery Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Call upon reaching chowk, do not ring bell"
                    className="w-full bg-gray-50 text-gray-900 text-sm rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] font-medium"
                  />
                </div>
              </div>

              {/* Card 2: Payment Method Selection (2 Buttons) */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-5">
                <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Banknote className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-950">
                      2. Choose Payment Method
                    </h2>
                    <p className="text-xs text-gray-500 font-normal">
                      Select Cash on Delivery or Online Payment
                    </p>
                  </div>
                </div>

                {/* 2 Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* BUTTON 1: CASH ON DELIVERY */}
                  <button
                    type="button"
                    onClick={handleCodClick}
                    className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${paymentMethod === "cod"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-xs"
                      : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <Banknote className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-950">
                        Cash on Delivery (COD)
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed font-normal">
                        Pay with cash or UPI scan at your doorstep upon receiving fresh items.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Instant 15–30 Min Dispatch</span>
                    </div>
                  </button>

                  {/* BUTTON 2: ONLINE PAYMENT */}
                  <button
                    type="button"
                    onClick={handleOnlinePaymentClick}
                    className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${paymentMethod === "online"
                      ? "border-[#fdd602] bg-yellow-50/50 shadow-xs"
                      : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span className="text-[11px] font-bold text-amber-800 bg-yellow-100 px-2.5 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-950">
                        Online Payment
                      </h4>
                    </div>

                    <div className="text-xs font-semibold text-amber-700">
                      <span>Coming Soon</span>
                    </div>
                  </button>

                </div>

                {/* Coming Soon Notice when user clicks Online Payment */}
                {onlineNotice && (
                  <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-xs sm:text-sm text-yellow-900 font-medium flex items-start gap-2.5 animate-fadeIn">
                    <Sparkles className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                    <span>{onlineNotice}</span>
                  </div>
                )}

              </div>

            </form>

          </div>

          {/* RIGHT COLUMN: Order Summary & Item List (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs space-y-5 sticky top-24">

              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-red" />
                  <h3 className="text-base font-bold text-gray-950">
                    Order Summary ({cart.cartCount} items)
                  </h3>
                </div>
              </div>

              {/* Items List */}
              <div className="max-h-72 overflow-y-auto pr-1 space-y-3 no-scrollbar divide-y divide-gray-100">
                {cart.cartItems.map((item) => (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {item.product.weight} &bull; Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-gray-950">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between items-center text-sm font-extrabold text-gray-950">
                  <span>Product Price</span>
                  <span className="text-xl text-brand-red font-black">₹{totalAmount}</span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full bg-brand-red hover:bg-brand-red-hover active:scale-98 text-white font-bold text-base py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Placing Your Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order &bull; ₹{totalAmount}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Estimated Doorstep Delivery: 15–30 Minutes</span>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
