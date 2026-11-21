"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const WhatsAppCTA: React.FC = () => {
  const { showToast } = useCart();

  const handleWhatsAppClick = () => {
    showToast("Coming Soon! WhatsApp order support will be available shortly.");
  };

  return (
    <section className="py-10 sm:py-14 bg-gray-50/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Card Container */}
        <div className="relative rounded-3xl overflow-hidden bg-[#12141a] border border-gray-800 shadow-2xl p-8 sm:p-12 lg:p-14">

          {/* Top-Right Large Red Circle */}
          <div className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-60 h-60 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-brand-red via-red-600 to-brand-red pointer-events-none shadow-2xl z-0" />

          {/* Subtle Decorative Starburst Doodle */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-20 z-0">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fdd602" strokeWidth="2">
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">

              {/* Eyebrow in Brand Yellow */}
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#fdd602]">
                CAN&apos;T FIND SOMETHING?
              </p>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]">
                Just tell us <br />
                what you need.
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-gray-300 font-normal max-w-lg leading-relaxed">
                Looking for an item not listed here? Send us the item name or your full list on WhatsApp, and we will get it delivered to you.
              </p>

              {/* Yellow WhatsApp CTA Button (Shows Toast Coming Soon) */}
              <div className="pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="inline-flex items-center gap-2 bg-[#fdd602] hover:bg-[#FFE600] text-gray-950 font-medium px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 text-base cursor-pointer"
                >
                  <span>Request on WhatsApp</span>
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform stroke-[2]" />
                </button>
              </div>

            </div>

            {/* Right Chat Graphic Showcase (5 Cols) */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-square flex items-center justify-center">

                {/* Floating Chat Elements */}
                <div className="relative w-full h-full flex flex-col justify-center items-center gap-3.5 z-10 px-2">

                  {/* Top Typing Bubble */}
                  <div className="self-end mr-8 sm:mr-12 relative animate-bounce">
                    <div className="bg-white rounded-2xl px-4 py-2.5 shadow-xl border border-gray-100 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse" />
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse delay-150" />
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse delay-300" />
                    </div>
                    {/* Tail */}
                    <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100" />
                  </div>

                  {/* Customer Question Bubble */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl px-5 sm:px-6 py-3 sm:py-3.5 shadow-2xl border border-gray-100 -rotate-2 hover:rotate-0 transition-transform duration-300 self-start ml-2 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      Hi! Can you help me find an item?
                    </p>
                  </div>

                  {/* Fast Delivery Response Bubble */}
                  <div className="bg-[#dcfce7] rounded-2xl sm:rounded-3xl px-5 sm:px-6 py-3 sm:py-3.5 shadow-2xl border border-emerald-200/60 rotate-1 hover:rotate-0 transition-transform duration-300 self-end mr-1 sm:mr-3">
                    <p className="text-xs sm:text-sm font-semibold text-emerald-950 flex items-center gap-1.5">
                      <span>Of course! Tell us what you need</span>
                      <span className="text-base">👋</span>
                    </p>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
