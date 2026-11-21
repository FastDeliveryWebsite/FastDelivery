"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface HeroSectionProps {
  onShopNowClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopNowClick: propOnShopNowClick }) => {
  const cart = useCart();
  const handleShopNow = propOnShopNowClick || cart.scrollToProducts;

  return (
    <section className="relative w-full bg-black overflow-hidden select-none min-h-[440px] sm:min-h-[500px] md:min-h-[540px] lg:min-h-[580px] flex items-center">
      
      {/* Background Graphic Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/home-page-images/hero-image.png"
          alt="Fast Delivery Hero Banner"
          fill
          priority
          quality={100}
          className="object-cover object-[68%_center] sm:object-center opacity-100 transition-all duration-300"
          sizes="100vw"
        />

        {/* Black Background Cover ONLY on the left text area */}
        <div className="absolute inset-y-0 left-0 w-[85%] sm:w-[65%] md:w-[52%] lg:w-[46%] bg-gradient-to-r from-black via-black/90 md:via-black/85 to-transparent z-[1] pointer-events-none" />
      </div>

      {/* Main Content Layer (z-10) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full">
        <div className="max-w-[340px] sm:max-w-[460px] md:max-w-[500px] lg:max-w-[540px] text-left space-y-3 sm:space-y-4">
          
          {/* Main Headline with Balanced Text Size */}
          <h1 className="text-3xl sm:text-5xl lg:text-[62px] xl:text-[68px] font-black tracking-tight leading-[1.08] italic">
            <span className="block text-white">
              Daily Essentials,
            </span>
            <span className="block text-white">
              Delivered to Your
            </span>
            
            {/* DOORSTEP! in clean flat #fdd602 */}
            <span className="relative inline-block mt-1 sm:mt-1.5">
              <span className="text-[#fdd602] font-black uppercase tracking-tight">
                DOORSTEP!
              </span>

              {/* Clean Red-to-Yellow Curved Underline */}
              <svg
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 overflow-visible pointer-events-none"
                viewBox="0 0 320 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 2,5 Q 130,20 315,3 Q 150,12 2,10 Z"
                  fill="url(#swooshGradient)"
                />
                <defs>
                  <linearGradient id="swooshGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#E21B23" />
                    <stop offset="65%" stopColor="#FF4D00" />
                    <stop offset="100%" stopColor="#fdd602" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white text-xs sm:text-sm md:text-base font-medium leading-snug sm:leading-relaxed max-w-[320px] sm:max-w-[420px] pt-1">
            Groceries, Food, Medicines and Household Needs — all in one place!
          </p>

          {/* Shop Now Button with exact #fdd602 color */}
          <div className="pt-2 sm:pt-3">
            <button
              onClick={handleShopNow}
              className="inline-flex items-center gap-2 sm:gap-2.5 bg-[#fdd602] hover:bg-[#ebd202] text-black font-extrabold text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
            </button>
          </div>

        </div>
      </div>

    </section>
  );
};
