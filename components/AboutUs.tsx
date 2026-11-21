"use client";

import React from "react";
import Link from "next/link";
import { 
  Truck, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  HeartHandshake, 
  ShoppingBag, 
  CheckCircle2, 
  MessageCircle,
  Users,
  Store,
  Sparkles
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export const AboutUs: React.FC = () => {
  const { showToast } = useCart();
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 pb-24 font-sans font-normal">
      {/* Hero Section */}
      <section className="bg-[#0c0d10] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#fdd602]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-brand-red/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900 border border-gray-800 text-sm sm:text-base font-medium text-[#fdd602]">
            <MapPin className="w-4 h-4 text-brand-red" />
            <span>Dedicated to Bilariyaganj, Azamgarh (U.P.)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Bilariyaganj&apos;s Own <span className="text-[#fdd602]">Hyper-Local</span> Delivery Partner
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 font-normal leading-relaxed">
            Delivering daily groceries, farm-fresh vegetables, dairy, household staples, and essential medicines straight to your doorstep in 15 to 30 minutes.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="px-7 py-3 rounded-full bg-[#fdd602] hover:bg-[#e6c200] text-gray-950 font-medium text-base transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-base border border-gray-700 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4 text-[#fdd602]" />
              <span>Contact Our Hub</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-14">
        
        {/* Quick Numbers Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 bg-white rounded-3xl shadow-sm border border-gray-200/90 p-6 sm:p-8">
          <div className="text-center space-y-1 border-r border-gray-100 last:border-none">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">15-30 <span className="text-brand-red text-lg font-semibold">Mins</span></div>
            <div className="text-sm sm:text-base font-normal text-gray-600">Fast Local Dispatch</div>
          </div>
          <div className="text-center space-y-1 md:border-r border-gray-100 last:border-none">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">₹0</div>
            <div className="text-sm sm:text-base font-normal text-gray-600">No Minimum Order</div>
          </div>
          <div className="text-center space-y-1 border-r border-gray-100 last:border-none">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">100%</div>
            <div className="text-sm sm:text-base font-normal text-gray-600">Fresh & Guaranteed</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">Bilariyaganj</div>
            <div className="text-sm sm:text-base font-normal text-gray-600">Market Rate Pricing</div>
          </div>
        </div>

        {/* Our Mission & Story */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-100 text-yellow-900 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Story</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
              Built Specifically for the Families of Bilariyaganj
            </h2>
            <p className="text-base text-gray-600 leading-relaxed font-normal">
              We started <strong>Fast Delivery</strong> with a very simple observation: while big cities enjoy 10-minute grocery apps, residents and families in Bilariyaganj still have to walk to the chowk in extreme heat, rain, or busy evenings just for everyday salt, milk, vegetables, or spices.
            </p>
            <p className="text-base text-gray-600 leading-relaxed font-normal">
              We partnered directly with trusted local Bilariyaganj merchants, farmers, and wholesale mandi vendors. Our local fleet of delivery riders knows every street, lane, and landmark in Bilariyaganj — ensuring your essential items reach your kitchen quickly and reliably.
            </p>
            
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-3 text-sm sm:text-base font-medium text-gray-800">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span>Transparent Bilariyaganj mandi rates with zero surge pricing</span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base font-medium text-gray-800">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span>Handpicked quality inspection before every single delivery</span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base font-medium text-gray-800">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span>Cash on Delivery (COD) & UPI payment on arrival</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0c0d10] text-white p-7 sm:p-10 rounded-3xl shadow-lg border border-gray-800 relative overflow-hidden space-y-6">
            <div className="space-y-1.5">
              <span className="text-[#fdd602] font-semibold text-xs sm:text-sm uppercase tracking-widest">Local Commitment</span>
              <h3 className="text-xl sm:text-2xl font-bold">Why We Are Different</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-gray-800 text-[#fdd602] shrink-0 mt-0.5">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">Empowering Local Bilariyaganj Shops</h4>
                  <p className="text-sm text-gray-300 font-normal mt-0.5 leading-relaxed">
                    We don&apos;t replace local businesses. We source directly from Bilariyaganj shopkeepers, boosting our town&apos;s local economy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-gray-800 text-brand-red shrink-0 mt-0.5">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">Dedicated Neighborhood Riders</h4>
                  <p className="text-sm text-gray-300 font-normal mt-0.5 leading-relaxed">
                    Our riders are local youth from Bilariyaganj who know every gully and reach you without endless phone calls for directions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-gray-800 text-green-400 shrink-0 mt-0.5">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">Direct Human Support</h4>
                  <p className="text-sm text-gray-300 font-normal mt-0.5 leading-relaxed">
                    No automated bots. You connect directly with our local admin desk for any assistance.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-sm sm:text-base font-medium text-gray-300">
              <span>Fast Bilariyaganj Dispatch</span>
              <span className="text-[#fdd602]">Direct to Doorstep</span>
            </div>
          </div>
        </section>

        {/* 4 Pillars of Fast Delivery */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Promises to Every Customer</h2>
            <p className="text-base text-gray-600 font-normal max-w-xl mx-auto">
              Every package dispatched from our hub meets strict local standards of freshness, hygiene, and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-sm transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-brand-red">
                <Clock className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Speed & Reliability</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                Orders are packed within 5 minutes of receipt and delivered to any ward in Bilariyaganj in 15–30 minutes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-sm transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">100% Quality Checked</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                Vegetables and grocery packets are visually inspected for freshness, expiry dates, and proper packaging.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-sm transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                <ShoppingBag className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No Order Too Small</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                Need just one packet of milk or a single kilogram of sugar? We deliver without forcing minimum cart values.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-sm transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Users className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Friendly Local Riders</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                Respectful, well-mannered delivery boys trained to deliver securely right to your doorstep.
              </p>
            </div>
          </div>
        </section>

        {/* WhatsApp & Hub CTA */}
        <section className="bg-white border border-gray-200/90 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xs">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Have a Question or Need a Custom Order?</h2>
            <p className="text-base text-gray-600 font-normal">
              Can&apos;t find an item on our catalog? Send us a quick note on WhatsApp and our Bilariyaganj team will arrange it for you.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => showToast("Coming Soon! WhatsApp order support will be available shortly.")}
              className="px-7 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-base flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
              <span>Message on WhatsApp</span>
            </button>
            <Link
              href="/contact"
              className="px-7 py-3 rounded-full bg-gray-900 hover:bg-black text-white font-medium text-base transition-all active:scale-95"
            >
              <span>View Contact Page</span>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};
