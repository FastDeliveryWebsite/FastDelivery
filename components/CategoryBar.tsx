"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ShoppingBag,
  UtensilsCrossed,
  Pill,
  Carrot,
  Milk,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CATEGORIES, Category } from "@/data/mockData";
import { useCart } from "@/context/CartContext";

interface CategoryBarProps {
  activeCategory?: string | null;
  onSelectCategory?: (slug: string | null) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "grocery-staples": <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-brand-red shrink-0" />,
  "food-drinks": <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />,
  "medicines": <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />,
  "vegetables": <Carrot className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />,
  "dairy-products": <Milk className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500 shrink-0" />,
  "home-cleaning": <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 shrink-0" />,
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory: propActiveCategory,
  onSelectCategory: propOnSelectCategory,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const cart = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

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
              name: c.name,
              slug: c.slug,
              iconName: "ShoppingBag",
              image: c.image || "/placeholder.png",
            }))
          );
        }
      } catch (err) {
        console.warn("CategoryBar: using fallback categories", err);
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Derive active category from pathname or context
  const slugFromPath = pathname?.startsWith("/category/")
    ? pathname.replace("/category/", "")
    : null;

  const activeCategory =
    propActiveCategory !== undefined
      ? propActiveCategory
      : slugFromPath || cart.activeCategory;

  const handleSelect = (slug: string) => {
    if (propOnSelectCategory) {
      propOnSelectCategory(slug);
    }
    // Redirects directly to that particular category page with correct filter
    router.push(`/category/${slug}`);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-xs relative z-30 select-none font-sans font-normal">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 relative flex items-center">
        
        {/* Mobile Left Scroll Arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="md:hidden p-1.5 text-gray-500 hover:text-black shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories Horizontal Slider */}
        <div
          ref={scrollContainerRef}
          className="flex items-center justify-start md:justify-center gap-2 sm:gap-5 lg:gap-6 py-2.5 sm:py-3 overflow-x-auto scroll-smooth no-scrollbar w-full px-1"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {categories.map((cat) => {
            const normActive = (activeCategory || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            const normSlug = (cat.slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            const normName = (cat.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            const isSelected =
              Boolean(activeCategory) &&
              (activeCategory === cat.slug ||
               (normActive && normActive === normSlug) ||
               (normActive && normActive === normName) ||
               (cat.id && activeCategory === cat.id));
            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => handleSelect(cat.slug)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-red-50 text-brand-red font-semibold ring-1 ring-brand-red/30 shadow-xs"
                    : "text-gray-700 hover:text-brand-red hover:bg-gray-50 font-normal active:scale-95"
                }`}
                style={{ scrollSnapAlign: "start" }}
              >
                {CATEGORY_ICONS[cat.slug] || <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-brand-red shrink-0" />}
                <span>{cat.name.replace("& Staples", "").replace("Products", "")}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Right Scroll Arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="md:hidden p-1.5 text-gray-500 hover:text-black shrink-0 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
