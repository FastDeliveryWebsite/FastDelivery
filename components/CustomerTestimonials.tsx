"use client";

import React from "react";
import { Star, CheckCircle, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/mockData";

export const CustomerTestimonials: React.FC = () => {
  // Duplicate array for seamless infinite marquee loop
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-14 sm:py-20 bg-gray-50/70 border-t border-gray-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        
        {/* Section Header with Increased Text Sizes */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-950 tracking-tight">
                Customer Testimonials
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 font-semibold max-w-xl leading-relaxed">
              Real reviews from happy shoppers and families across Bilariyaganj
            </p>
          </div>
        </div>

      </div>

      {/* Auto-Slider Carousel - Sliding from Right to Left continuously */}
      <div className="relative w-full overflow-hidden">
        
        {/* Left & Right Smooth Edge Fade Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-gray-50/90 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-gray-50/90 to-transparent z-10" />

        {/* Marquee Track */}
        <div className="animate-marquee gap-6 py-2">
          {duplicatedTestimonials.map((item, index) => {
            const initials = item.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            return (
              <div
                key={`${item.id}-${index}`}
                className="w-[320px] sm:w-[380px] lg:w-[420px] flex-shrink-0 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs hover:shadow-card hover:border-gray-300 transition-all duration-300 flex flex-col justify-between select-none group"
              >
                <div>
                  {/* Top Row: 5 Stars + Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-7 h-7 text-gray-200 group-hover:text-brand-red/30 transition-colors" />
                  </div>

                  {/* Customer Comment - Increased Size */}
                  <p className="text-sm sm:text-base lg:text-lg text-gray-800 font-semibold leading-relaxed mb-6 line-clamp-3">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                </div>

                {/* Customer Profile Bottom Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3.5">
                    {/* Initials Avatar */}
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${item.avatarColor} text-white font-black text-sm sm:text-base flex items-center justify-center shadow-xs flex-shrink-0`}
                    >
                      {initials}
                    </div>

                    {/* Name & Location - Increased Text Size */}
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-gray-950 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 font-bold line-clamp-1">
                        {item.location}
                      </p>
                    </div>
                  </div>

                  {/* Verified Customer Badge */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};
