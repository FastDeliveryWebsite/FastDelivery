"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  HelpCircle,
  Truck,
  ShieldCheck,
  ChevronDown,
  Store,
  Sparkles,
  Loader2,
  AlertCircle,
  Phone,
  Mail
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export const ContactUs: React.FC = () => {
  const { showToast } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please enter your mobile phone number.");
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage("Please enter your query message.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          phone: "",
          email: "",
          subject: "General Inquiry",
          message: ""
        });
      } else {
        setErrorMessage(data.message || "Failed to submit your message. Please try again.");
      }
    } catch {
      setErrorMessage("Network error: Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppAction = () => {
    window.open("https://wa.me/919876543210?text=Hi%20Fast%20Delivery%20Bilariyaganj%2C%20I%20have%20an%20inquiry", "_blank");
  };

  const faqs = [
    {
      q: "How fast is delivery within Bilariyaganj?",
      a: "Our dedicated local dispatch team packs your order immediately. Deliveries to main Bilariyaganj town and nearby wards are typically completed within 15 to 30 minutes."
    },
    {
      q: "Is there any minimum order value?",
      a: "No! There is absolutely no minimum order requirement. Whether you need a single packet or a full month's grocery list, we deliver to your doorstep."
    },
    {
      q: "What payment methods are supported?",
      a: "We support Cash on Delivery (COD) and all UPI apps (Google Pay, PhonePe, Paytm) upon arrival. You only pay once you inspect your items."
    },
    {
      q: "Can I request an item that is not listed on the website?",
      a: "Yes! Simply drop us a note with what you need, and our local riders will purchase it from verified Bilariyaganj shops and bring it directly to you."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 pb-24 font-sans font-normal">
      
      {/* Hero Header */}
      <section className="bg-[#0c0d10] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-brand-red/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-[#fdd602]/10 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900 border border-gray-800 text-sm sm:text-base font-medium text-[#fdd602]">
            <MapPin className="w-4 h-4 text-brand-red" />
            <span>Bilariyaganj Local Help Desk</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            We&apos;re Here to <span className="text-[#fdd602]">Help You</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 font-normal leading-relaxed">
            Have questions about your order, delivery address, or want to request a product? Reach out to our local Bilariyaganj team.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-12">
        
        {/* Top 3 High-Impact Cards (Shows Coming Soon Toast on Click) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: WhatsApp Quick Support */}
          <button
            type="button"
            onClick={handleWhatsAppAction}
            className="bg-white p-7 sm:p-8 rounded-3xl shadow-sm border border-gray-200/90 hover:border-green-500 hover:shadow-md transition-all group flex flex-col justify-between text-left cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#25D366] flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageCircle className="w-7 h-7 fill-[#25D366] text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">WhatsApp Chat</h3>
              <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed">
                Connect directly with our local dispatch team for quick orders, location sharing, or special requests.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-base font-medium text-green-600 w-full">
              <span>Start Chat</span>
              <span className="text-gray-400 group-hover:translate-x-1.5 transition-transform text-lg">&rarr;</span>
            </div>
          </button>

          {/* Card 2: Physical Hub Location */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl shadow-sm border border-gray-200/90 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Delivery Hub</h3>
              <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed">
                Main Market Chowk, Bilariyaganj, Azamgarh District, Uttar Pradesh - 276121.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-base font-medium text-gray-800">
              <span className="flex items-center gap-2">
                <Store className="w-4 h-4 text-brand-red" />
                Local Bilariyaganj Center
              </span>
            </div>
          </div>

          {/* Card 3: Quality & Local Promise */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl shadow-sm border border-gray-200/90 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">100% Local Service</h3>
              <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed">
                Directly connected with Bilariyaganj shopkeepers and riders to ensure trusted, authentic doorstep delivery.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-base font-medium text-brand-red">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Guaranteed Freshness
              </span>
            </div>
          </div>

        </div>

        {/* Contact Form & Coverage Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-10 shadow-sm border border-gray-200/90 space-y-6">
            <div className="space-y-1.5">
              <span className="text-sm font-semibold text-brand-red uppercase tracking-wider">Quick Inquiry</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Send Us a Direct Message</h2>
              <p className="text-base text-gray-600 font-normal leading-relaxed">
                Fill this form to quickly send your inquiry or order request to our Bilariyaganj team.
              </p>
            </div>

            {/* Submission Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-green-50 border border-green-200 text-center space-y-3 animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Message Received!</h3>
                <p className="text-base text-gray-700 font-normal max-w-md mx-auto leading-relaxed">
                  Your message has been saved into our system. Our local Bilariyaganj support desk will assist you shortly on your contact number.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setErrorMessage(null);
                    }}
                    className="px-6 py-2.5 rounded-full bg-brand-red text-white font-semibold text-sm hover:bg-brand-red-hover transition-colors cursor-pointer shadow-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm sm:text-base font-medium text-gray-700 block">
                      Your Full Name <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#fdd602] font-normal text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm sm:text-base font-medium text-gray-700 block">
                      Mobile Number <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#fdd602] font-normal text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm sm:text-base font-medium text-gray-700 block">
                      Email Address <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#fdd602] font-normal text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm sm:text-base font-medium text-gray-700 block">
                      Query Category
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#fdd602] font-normal text-gray-900 bg-white"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Order Status">Check Order Status</option>
                      <option value="Product Request">Request an Unlisted Product</option>
                      <option value="Delivery Address">Delivery Address or Landmark</option>
                      <option value="Shop Partnership">Shopkeeper / Vendor Partnership</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm sm:text-base font-medium text-gray-700 block">
                    Your Message or Product List <span className="text-brand-red">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what items you need or write your message here..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#fdd602] font-normal text-gray-900 placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-brand-red hover:bg-brand-red-hover disabled:opacity-60 text-white font-medium text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Local Coverage & Information (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Delivery Coverage Card */}
            <div className="bg-[#0c0d10] text-white rounded-3xl p-7 sm:p-8 shadow-sm border border-gray-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-gray-800 text-[#fdd602]">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">Active Delivery Areas</h3>
                  <p className="text-sm text-gray-400 font-normal">Serving All Bilariyaganj Localities</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-sm sm:text-base font-normal text-gray-200 pt-1">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span>Main Chowk Bazar</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span>Purana Bazar</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span>Kasba Wards</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span>Station Road</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span>Jiyanpur Marg</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span>All Nearby Wards</span>
                </div>
              </div>

              <p className="text-sm text-gray-400 font-normal border-t border-gray-800 pt-3 leading-relaxed">
                Living in a nearby locality or village around Bilariyaganj? Contact our dispatch hub with your location to confirm doorstep delivery.
              </p>
            </div>

            {/* Quick WhatsApp Action Banner (Shows Toast) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-xs flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">Direct WhatsApp Help</h4>
                <p className="text-sm text-gray-500 font-normal">Quick order assistance anytime</p>
              </div>
              <button
                type="button"
                onClick={handleWhatsAppAction}
                className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-sm shadow-xs transition-transform active:scale-95 shrink-0 cursor-pointer"
              >
                Chat Now
              </button>
            </div>

          </div>

        </div>

        {/* Frequently Asked Questions */}
        <section className="bg-white rounded-3xl p-7 sm:p-10 border border-gray-200/90 shadow-xs space-y-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 text-base sm:text-lg font-medium text-gray-900 hover:text-brand-red transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-brand-red" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-2.5 text-base text-gray-600 font-normal leading-relaxed pr-8">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};
