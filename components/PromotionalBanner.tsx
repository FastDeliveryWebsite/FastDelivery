"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart, Sparkles } from "lucide-react";

export const PromotionalBanner: React.FC = () => {
  const scrollToProducts = () => {
    const el = document.getElementById("products-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Container with Two-Tone Split Background - Increased Height */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] flex flex-col justify-between">
          
          {/* Background Split: Upper ~62% Dark Charcoal, Bottom ~38% Crisp White */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top Dark Background */}
            <div className="absolute top-0 inset-x-0 h-[62%] sm:h-[63%] bg-[#111318]" />
            {/* Bottom White Background */}
            <div className="absolute bottom-0 inset-x-0 h-[38%] sm:h-[37%] bg-white border-t border-gray-100" />
          </div>

          {/* Decorative Dot Matrix Patterns - Placed cleanly with ample spacing */}
          <div className="absolute bottom-3 left-6 sm:left-10 z-10 pointer-events-none opacity-80 hidden sm:block">
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 18 }).map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#fdd602]" />
              ))}
            </div>
          </div>
          <div className="absolute bottom-3 right-6 sm:right-10 z-10 pointer-events-none opacity-80 hidden sm:block">
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 18 }).map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#fdd602]" />
              ))}
            </div>
          </div>

          {/* Top Right Brand Tag */}
          <div className="absolute top-4 sm:top-6 right-4 sm:right-8 z-20">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-black text-[#fdd602]">Fast Delivery</span>
              <span className="hidden sm:inline text-gray-300 font-semibold">| Bilariyaganj</span>
            </div>
          </div>

          {/* Grid Content Layout */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-6 sm:p-10 lg:p-12 items-center flex-1">
            
            {/* Left Content (Text in dark zone, CTA in white zone) */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full pt-4 sm:pt-6">
              
              {/* Upper Text (Dark Background Zone) */}
              <div className="space-y-1.5 sm:space-y-2 mb-10 sm:mb-16">
                
                {/* Yellow Sunburst / Spark Doodle */}
                <div className="flex items-center gap-2">
                  <svg
                    className="w-8 h-8 text-[#fdd602]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  >
                    <line x1="12" y1="2" x2="12" y2="7" />
                    <line x1="4.93" y1="4.93" x2="8.46" y2="8.46" />
                    <line x1="19.07" y1="4.93" x2="15.54" y2="8.46" />
                  </svg>
                </div>

                {/* Main Headline */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]">
                  For All Your <br />
                  <span className="text-white">Everyday Needs</span>
                </h2>

                {/* Yellow Script / Cursive Accent Subtitle */}
                <p className="text-2xl sm:text-3xl font-serif italic text-[#fdd602] font-black tracking-wide pt-1">
                  Now Just a Click Away!
                </p>
              </div>

              {/* Lower CTA Button (White Background Zone) - Good gap above dots */}
              <div className="pb-6 sm:pb-8 pt-2">
                <button
                  onClick={scrollToProducts}
                  className="inline-flex items-center gap-2.5 bg-[#fdd602] hover:bg-[#FFE600] text-gray-950 font-black px-7 sm:px-9 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 text-xs sm:text-sm uppercase tracking-wider group cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 fill-current group-hover:-rotate-12 transition-transform" />
                  <span>ORDER NOW</span>
                </button>
              </div>

            </div>

            {/* Right Product Graphic (Breaks across the Dark/White split) */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px] aspect-[4/3] hover:scale-103 transition-transform duration-500">
                <Image
                  src="/home-page-images/promo-grocery.png"
                  alt="Everyday Groceries and Staples"
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 1024px) 100vw, 520px"
                  priority
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
