"use client";

import React from "react";
import Image from "next/image";
import { Zap, ShieldCheck, Tag, Headphones } from "lucide-react";
import { WHY_CHOOSE_US } from "@/data/mockData";

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6 text-brand-red fill-brand-red/20" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-brand-red fill-brand-red/20" />,
  Tag: <Tag className="w-6 h-6 text-brand-red fill-brand-red/20" />,
  Headphones: <Headphones className="w-6 h-6 text-brand-red fill-brand-red/20" />,
};

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Why Choose Fast Delivery?
          </h2>
          <div className="w-12 h-1 bg-brand-red rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

          {/* 4 Feature Cards (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 sm:gap-4">
            {WHY_CHOOSE_US.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50/90 hover:bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 hover:border-brand-red/30 hover:shadow-card transition-all duration-300 flex flex-col items-center text-center group"
              >
                {/* Icon Container */}
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-red-100/70 border border-red-200/50 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-red-500/10 transition-all">
                  {FEATURE_ICONS[item.icon]}
                </div>

                <h3 className="text-sm sm:text-base font-black text-gray-900 mb-1 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-gray-600 font-semibold leading-normal">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Right Promo Banner with whychoose.png - Increased Size (7 cols) */}
          <div className="lg:col-span-7 flex items-center justify-center h-full">
            <div className="relative w-full aspect-[2/1] rounded-2xl sm:rounded-3xl overflow-hidden">
              <Image
                src="/home-page-images/whychoose.png"
                alt="Your Everyday Needs... Now Just a Click Away!"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 750px"
                priority
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
