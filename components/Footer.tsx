"use client";

import React from "react";
import Link from "next/link";
import { Zap, CheckCircle2, ShieldCheck, Banknote, Truck, Phone, MessageCircle, Heart } from "lucide-react";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/data/mockData";
import { useCart } from "@/context/CartContext";

export const Footer: React.FC = () => {
  const { showToast } = useCart();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToProducts = () => {
    const el = document.getElementById("products-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-white text-gray-900 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* Main Footer Grid: 3 Clean Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* Column 1: Brand Info & Contact (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div onClick={scrollToTop} className="cursor-pointer inline-block">
              <Logo variant="dark" size="lg" />
            </div>

            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed max-w-md">
              Bilariyaganj&apos;s trusted hyper-local delivery service. Order daily groceries, fresh vegetables, dairy products, medicines, and household essentials directly to your home.
            </p>

            {/* Quick Contact Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => showToast("Coming Soon! WhatsApp order support will be available shortly.")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-xs transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Order on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Column 2: Categories (3 cols) - No red line, clean black text */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 uppercase tracking-wider">
              Categories
            </h3>

            <ul className="space-y-2.5 text-sm sm:text-base font-normal">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-gray-600 hover:text-black transition-colors text-left flex items-center gap-2 group font-normal cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-brand-red transition-colors" />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Highlights (4 cols) - Proper Lucide SVG Icons */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 uppercase tracking-wider">
              Highlights
            </h3>

            <ul className="space-y-3 text-sm sm:text-base text-gray-600 font-normal">
              <li className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Fast Local Dispatch</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No Minimum Order</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Bilariyaganj Market Rates</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Banknote className="w-4 h-4 text-green-600 shrink-0" />
                <span>Cash on Delivery & Online Payment</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-brand-red shrink-0" />
                <span>Direct to Doorstep</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Location */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500 font-normal">
          <p>© {new Date().getFullYear()} Fast Delivery. All rights reserved.</p>

          <div className="flex items-center gap-4 font-medium text-gray-600">
            <Link href="/about" className="hover:text-brand-red transition-colors">About Us</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-brand-red transition-colors">Contact Us</Link>
          </div>

          <div className="flex items-center gap-1.5 text-gray-700 font-medium">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-brand-red fill-brand-red" />
            <span>for Bilariyaganj, Uttar Pradesh</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
