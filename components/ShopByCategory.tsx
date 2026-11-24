"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface ShopByCategoryProps {
  onSelectCategory?: (slug: string) => void;
}

const SIX_CATEGORIES = [
  {
    id: "grocery",
    slug: "grocery-staples",
    name: "Grocery",
    image: "/home-page-images/grocery.jpg",
  },
  {
    id: "food-drinks",
    slug: "food-drinks",
    name: "Food & Drinks",
    image: "/home-page-images/food&snacks.png",
  },
  {
    id: "medicines",
    slug: "medicines",
    name: "Medicines",
    image: "/home-page-images/medicine.png",
  },
  {
    id: "vegetables",
    slug: "vegetables",
    name: "Vegetables",
    image: "/home-page-images/vegetables.jpg",
  },
  {
    id: "dairy",
    slug: "dairy-products",
    name: "Dairy",
    image: "/home-page-images/dairy.png",
  },
  {
    id: "home-cleaning",
    slug: "home-cleaning",
    name: "Home & Cleaning",
    image: "/home-page-images/homecleaning.png",
  },
];

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ onSelectCategory: propOnSelectCategory }) => {
  const router = useRouter();
  const [categories, setCategories] = useState(SIX_CATEGORIES);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(
            data.categories.map((c: any) => ({
              id: c.id || c.slug,
              slug: c.slug,
              name: c.name,
              image: c.image || "/home-page-images/grocery.jpg",
            }))
          );
        }
      } catch (err) {
        console.warn("ShopByCategory: using fallback categories", err);
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelect = (slug: string) => {
    if (propOnSelectCategory) {
      propOnSelectCategory(slug);
    } else {
      router.push(`/category/${slug}`);
    }
  };

  // Only display up to 7 categories on the Home page (admin creates more -> click Browse All)
  const displayedCategories = categories.slice(0, 7);

  return (
    <section className="py-10 sm:py-12 bg-white border-b border-gray-100 select-none font-sans font-normal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
          </div>

          <Link
            href="/category"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand-red hover:text-brand-red-hover transition-colors cursor-pointer group"
          >
            <span>Browse All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Display up to 7 Categories Cleanly inside the Container with Enlarged Visuals */}
        <div className="flex items-center justify-start md:justify-center gap-4 sm:gap-5 md:gap-7 lg:gap-8 overflow-x-auto md:overflow-visible no-scrollbar py-3 px-1">
          {displayedCategories.map((cat) => (
            <div
              key={cat.id || cat.slug}
              onClick={() => handleSelect(cat.slug)}
              className="flex flex-col items-center group cursor-pointer shrink-0 transition-transform active:scale-95"
            >
              {/* Circular Container with Enlarged Responsive Image Inside */}
              <div className="relative w-22 h-22 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden bg-gray-100 border-[2.5px] border-gray-200 shadow-xs group-hover:scale-105 group-hover:border-brand-red group-hover:shadow-lg transition-all duration-300">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 90px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Category Name Outside Below Circle */}
              <span className="mt-2.5 text-xs sm:text-sm md:text-base font-semibold text-gray-900 group-hover:text-brand-red transition-colors text-center line-clamp-1 max-w-[95px] sm:max-w-[120px] md:max-w-[140px] block tracking-tight">
                {cat.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
