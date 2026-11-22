"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowRight, Check } from "lucide-react";
import { POPULAR_PRODUCTS, Product } from "@/data/mockData";
import { useCart } from "@/context/CartContext";

interface PopularProductsProps {
  onAddToCart?: (product: Product) => void;
  cartItemsMap?: Record<string, number>;
}

export const PopularProducts: React.FC<PopularProductsProps> = ({
  onAddToCart: propOnAddToCart,
  cartItemsMap: propCartItemsMap,
}) => {
  const cart = useCart();
  const [products, setProducts] = useState<Product[]>(POPULAR_PRODUCTS);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPopularProducts = async () => {
      try {
        const res = await fetch("/api/products?limit=10", { cache: "no-store" });
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(
            data.products.map((p: any) => ({
              id: p.id,
              name: p.name,
              weight: p.weight || "1 Unit",
              price: Number(p.price),
              originalPrice: p.original_price ? Number(p.original_price) : undefined,
              image: p.image || "/placeholder.png",
              category: p.category_name || "General",
              inStock: true,
              specifications: Array.isArray(p.specifications)
                ? p.specifications.reduce((acc: any, curr: any) => {
                    if (curr?.label) acc[curr.label] = curr.value;
                    return acc;
                  }, {})
                : p.specifications,
            }))
          );
        }
      } catch (err) {
        console.warn("PopularProducts: using fallback mock data", err);
      }
    };

    fetchPopularProducts();
    return () => {
      isMounted = false;
    };
  }, []);

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
    <section id="products-section" className="py-10 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Popular Products
            </h2>
          </div>

          <Link
            href="/category"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-red hover:text-brand-red-hover transition-colors group cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {products.map((product) => {
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
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                  </Link>

                  {/* Left-Aligned Product Details */}
                  <div className="text-left space-y-0.5 mb-2.5">
                    <Link href={`/product/${product.id}`} className="block">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 group-hover:text-brand-red transition-colors line-clamp-1 tracking-tight cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] sm:text-xs text-gray-500 font-normal">
                      {product.weight}
                    </p>

                    {/* Price */}
                    <div className="pt-0.5 flex items-baseline justify-start gap-1.5 text-left">
                      <span className="text-lg sm:text-xl font-bold text-gray-950">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] sm:text-xs text-gray-400 line-through font-normal">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Add to Cart Red Button */}
                <button
                  onClick={() => handleAdd(product)}
                  className={`w-full py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-xs cursor-pointer ${isJustAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-brand-red hover:bg-brand-red-hover text-white active:scale-95"
                    }`}
                >
                  {isJustAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added!</span>
                    </>
                  ) : quantityInCart > 0 ? (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>In Cart ({quantityInCart})</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
