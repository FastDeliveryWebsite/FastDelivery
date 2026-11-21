"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Check,
  Plus,
  Minus,
  ArrowLeft,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { ALL_PRODUCTS, Product } from "@/data/mockData";
import { useCart } from "@/context/CartContext";

export const ProductPreview: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const cart = useCart();
  const productId = params?.id as string;

  const product = ALL_PRODUCTS.find((p) => p.id === productId);
  const [justAdded, setJustAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
          Product Not Found
        </h2>
        <p className="text-gray-500 font-medium mb-6 max-w-md">
          The product you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#fdd602] hover:bg-[#FFE600] text-gray-950 font-black px-6 py-3 rounded-xl shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  // Similar Products (down 4 to 5 products)
  const similarProducts = ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 5);

  const fallbackProducts =
    similarProducts.length >= 4
      ? similarProducts
      : ALL_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 5);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const quantityInCart = cart.cartItemsMap[product.id] || 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      cart.addToCart(product);
    }
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1500);
  };

  return (
    <div className="py-6 sm:py-10 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 mb-6">
          <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-gray-700">{product.category}</span>
          <span>/</span>
          <span className="text-gray-950 font-bold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        {/* Product Details Two-Column Layout (Image on Left, Details on Right) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200 shadow-xs mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Side: Product Image (5 cols) */}
            <div className="lg:col-span-5 w-full">
              <div className="relative w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shadow-inner group">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />

                {/* Badges on Image */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  <span className="bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                    In Stock
                  </span>
                  {discountPercent > 0 && (
                    <span className="bg-brand-red text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-200 text-xs font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#fdd602] fill-[#fdd602]" />
                    <span>Bilariyaganj Fresh</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Product Details & Specifications (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">

              <div className="space-y-3">
                {/* Category Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                  <span>{product.category}</span>
                </div>

                {/* Product Name */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Weight / Pack Size */}
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-500">
                    Net Quantity / Weight:
                  </span>
                  <span className="text-xs sm:text-sm font-black text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-lg border border-gray-200">
                    {product.weight}
                  </span>
                </div>

                {/* Price Display */}
                <div className="pt-2 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-gray-950">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg sm:text-xl text-gray-400 line-through font-semibold">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        Save ₹{product.originalPrice - product.price} ({discountPercent}% OFF)
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-semibold">
                  (Inclusive of all taxes • Bilariyaganj local market rate)
                </p>
              </div>

              {/* Quantity Selector & Add to Cart Action */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between sm:justify-center border border-gray-300 rounded-xl bg-white px-3 py-2 w-full sm:w-auto shrink-0 shadow-xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1.5 text-gray-600 hover:text-black rounded hover:bg-gray-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-base font-black text-gray-900 min-w-[2.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-1.5 text-gray-600 hover:text-black rounded hover:bg-gray-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-md ${justAdded
                      ? "bg-green-600 text-white"
                      : "bg-brand-red hover:bg-brand-red-hover text-white shadow-brand-red/20"
                      }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-5 h-5 stroke-[3]" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
                        <span>
                          {quantityInCart > 0
                            ? `Add More (Cart has ${quantityInCart})`
                            : `Add to Cart • ₹${product.price * quantity}`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Product Specifications Table */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                  Product Specifications
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-semibold block text-[11px]">Category</span>
                    <span className="font-bold text-gray-900">{product.category}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-semibold block text-[11px]">Weight / Size</span>
                    <span className="font-bold text-gray-900">{product.weight}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-semibold block text-[11px]">Availability</span>
                    <span className="font-bold text-emerald-600">In Stock (Bilariyaganj)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-semibold block text-[11px]">Delivery Time</span>
                    <span className="font-bold text-gray-900">15 – 30 Minutes</span>
                  </div>
                </div>
              </div>

              {/* Delivery & Trust Highlights */}
              <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-gray-700">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-red shrink-0" />
                  <span>Fast Local Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Easy Doorstep Support</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Down Section: 4 to 5 Similar Products */}
        <div className="mt-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Similar Products You May Like
              </h2>
              {/* <div className="w-10 h-1 bg-brand-red rounded-full" /> */}
            </div>
          </div>

          {/* 4 to 5 Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {fallbackProducts.map((item) => {
              const inCartCount = cart.cartItemsMap[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-gray-200 shadow-xs hover:shadow-card hover:border-gray-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <Link
                      href={`/product/${item.id}`}
                      className="block relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 mb-3 flex items-center justify-center border border-gray-100 cursor-pointer"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover group-hover:scale-108 transition-transform duration-500"
                      />
                    </Link>

                    <div className="text-left space-y-0.5 mb-2.5">
                      <Link href={`/product/${item.id}`} className="block">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-brand-red transition-colors line-clamp-1 tracking-tight cursor-pointer">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-[11px] sm:text-xs text-gray-500 font-normal">
                        {item.weight}
                      </p>

                      <div className="pt-0.5 flex items-baseline justify-start gap-1.5 text-left">
                        <span className="text-lg sm:text-xl font-bold text-gray-950">
                          ₹{item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-[11px] sm:text-xs text-gray-400 line-through font-normal">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => cart.addToCart(item)}
                      className="w-full py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm bg-brand-red hover:bg-brand-red-hover text-white flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-xs"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{inCartCount > 0 ? `In Cart (${inCartCount})` : "Add to Cart"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
