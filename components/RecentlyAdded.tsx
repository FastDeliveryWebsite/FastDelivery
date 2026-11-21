"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowRight, Check, Sparkles } from "lucide-react";
import { RECENTLY_ADDED_PRODUCTS, Product } from "@/data/mockData";
import { useCart } from "@/context/CartContext";

interface RecentlyAddedProps {
  onAddToCart?: (product: Product) => void;
  cartItemsMap?: Record<string, number>;
}

export const RecentlyAdded: React.FC<RecentlyAddedProps> = ({
  onAddToCart: propOnAddToCart,
  cartItemsMap: propCartItemsMap,
}) => {
  const cart = useCart();
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const cartItemsMap = propCartItemsMap || cart.cartItemsMap;
  const onAddToCart = propOnAddToCart || cart.addToCart;

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setJustAddedId(product.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1200);
  };

  return (
    <section id="recently-added-section" className="py-10 sm:py-12 bg-gray-50/60 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Recently Added
            </h2>
            {/* <div className="w-12 h-1 bg-brand-red rounded-full" /> */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Fresh Stock
            </span>
          </div>

          {/* <a
            href="#all-products"
            className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-brand-red hover:text-brand-red-hover transition-colors group cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a> */}
        </div>

        {/* Product Cards Grid - Consistent with Popular Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {RECENTLY_ADDED_PRODUCTS.map((product) => {
            const quantityInCart = cartItemsMap[product.id] || 0;
            const isJustAdded = justAddedId === product.id;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-gray-200 shadow-xs hover:shadow-card hover:border-gray-300 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Product Content Container */}
                <div>
                  {/* Clickable Image to Product Preview Page */}
                  <Link href={`/product/${product.id}`} className="block relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 mb-3 flex items-center justify-center border border-gray-100 cursor-pointer">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-500"
                    />

                    {/* Fresh 'NEW' badge on top left */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                        NEW
                      </span>
                    </div>
                  </Link>

                  {/* Left-Aligned Product Details */}
                  <div className="text-left space-y-0.5 mb-2.5">
                    <Link href={`/product/${product.id}`} className="block">
                      <h3 className="text-sm sm:text-base lg:text-lg font-black text-gray-900 group-hover:text-brand-red transition-colors line-clamp-1 tracking-tight cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] sm:text-xs text-gray-500 font-bold">
                      {product.weight}
                    </p>

                    {/* Price */}
                    <div className="pt-0.5 flex items-baseline justify-start gap-1.5 text-left">
                      <span className="text-lg sm:text-xl font-black text-gray-950">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] sm:text-xs text-gray-400 line-through font-semibold">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Left-aligned Add to Cart Button */}
                <div className="pt-1">
                  <button
                    onClick={() => handleAdd(product)}
                    className={`w-full py-2 sm:py-2.5 px-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-xs ${isJustAdded
                      ? "bg-green-600 text-white"
                      : "bg-brand-red hover:bg-brand-red-hover text-white hover:shadow-md"
                      }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                        <span>
                          {quantityInCart > 0 ? `Add More (${quantityInCart})` : "Add to Cart"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
