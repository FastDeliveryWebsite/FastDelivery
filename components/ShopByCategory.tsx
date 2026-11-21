"use client";

import React from "react";
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

  const handleSelect = (slug: string) => {
    if (propOnSelectCategory) {
      propOnSelectCategory(slug);
    } else {
      router.push(`/category/${slug}`);
    }
  };

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

        {/* All 6 Categories: Clean Responsive Circles */}
        <div className="flex items-center justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-10 overflow-x-auto md:overflow-visible no-scrollbar py-2 px-1">
          {SIX_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat.slug)}
              className="flex flex-col items-center group cursor-pointer shrink-0 md:shrink transition-transform active:scale-95"
            >
              {/* Circular Container with Responsive Image Inside */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full overflow-hidden bg-gray-100 border-[2px] border-gray-200 shadow-xs group-hover:scale-105 group-hover:border-brand-red group-hover:shadow-md transition-all duration-300">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 144px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Category Name Outside Below Circle */}
              <span className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base font-medium text-gray-900 group-hover:text-brand-red transition-colors text-center whitespace-nowrap block tracking-tight">
                {cat.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
