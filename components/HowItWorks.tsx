"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart, ClipboardList, Bike } from "lucide-react";

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#12141a] text-white relative overflow-hidden border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Centered Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2.5">
            How It Works?
          </h2>
          <div className="w-14 h-1 bg-brand-red rounded-full" />
        </div>

        {/* All in One Line: Steps 1, 2, 3 and Logo Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">

          {/* Steps 1, 2, 3 (lg:col-span-7 xl:col-span-8) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-2 lg:gap-3 xl:gap-4 relative">

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center relative group">
                <div className="w-7 h-7 rounded-full bg-brand-red text-white text-xs font-black flex items-center justify-center mb-2 shadow-md z-10">
                  1
                </div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-900 border-2 border-dashed border-gray-700 group-hover:border-[#fdd602] group-hover:scale-105 transition-all flex items-center justify-center mb-2.5 shadow-inner">
                  <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 text-[#fdd602] group-hover:scale-110 transition-transform" />
                </div>

                <h3 className="text-sm sm:text-base xl:text-lg font-black text-white mb-0.5 tracking-tight">
                  Choose Products
                </h3>
                <p className="text-[11px] sm:text-xs xl:text-[13px] text-gray-300 font-medium whitespace-nowrap">
                  Browse and add items to cart
                </p>

                {/* Connecting Arrow */}
                <div className="hidden sm:block absolute top-9 -right-2 lg:-right-3 text-gray-500 font-mono text-xs xl:text-sm font-bold tracking-widest pointer-events-none">
                  - - - &gt;
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center relative group">
                <div className="w-7 h-7 rounded-full bg-brand-red text-white text-xs font-black flex items-center justify-center mb-2 shadow-md z-10">
                  2
                </div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-900 border-2 border-dashed group-hover:border-[#fdd602] group-hover:scale-105 transition-all flex items-center justify-center mb-2.5 shadow-inner">
                  <ClipboardList className="w-7 h-7 sm:w-8 sm:h-8 text-[#fdd602] group-hover:scale-110 transition-transform" />
                </div>

                <h3 className="text-sm sm:text-base xl:text-lg font-black text-white mb-0.5 tracking-tight">
                  Place Your Order
                </h3>
                <p className="text-[11px] sm:text-xs xl:text-[13px] text-gray-300 font-medium whitespace-nowrap">
                  Enter details and confirm order
                </p>

                {/* Connecting Arrow */}
                <div className="hidden sm:block absolute top-9 -right-2 lg:-right-3 text-gray-500 font-mono text-xs xl:text-sm font-bold tracking-widest pointer-events-none">
                  - - - &gt;
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center relative group">
                <div className="w-7 h-7 rounded-full bg-brand-red text-white text-xs font-black flex items-center justify-center mb-2 shadow-md z-10">
                  3
                </div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-900 border-2 border-dashed border-gray-700 group-hover:border-[#fdd602] group-hover:scale-105 transition-all flex items-center justify-center mb-2.5 shadow-inner">
                  <Bike className="w-8 h-8 sm:w-9 sm:h-9 text-[#fdd602] group-hover:scale-110 transition-transform" />
                </div>

                <h3 className="text-sm sm:text-base xl:text-lg font-black text-white mb-0.5 tracking-tight">
                  We Deliver
                </h3>
                <p className="text-[11px] sm:text-xs xl:text-[13px] text-gray-300 font-medium whitespace-nowrap">
                  Our local delivery partner will deliver to your doorstep
                </p>
              </div>

            </div>
          </div>

          {/* Logo in the same horizontal line - Enlarged Size */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end items-center">
            <div className="relative max-w-[320px] sm:max-w-[380px] lg:max-w-[430px] xl:max-w-[480px] w-full px-2 hover:scale-105 transition-transform duration-300">
              <Image
                src="/home-page-images/howitworks.png"
                alt="Fast. Simple. Reliable."
                width={550}
                height={275}
                className="w-full h-auto object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
