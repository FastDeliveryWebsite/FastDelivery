"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  Check, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag,
  ShoppingCart,
  Sparkles
} from "lucide-react";
import { ALL_PRODUCTS, CATEGORIES, Product } from "@/data/mockData";
import { useCart } from "@/context/CartContext";

const ITEMS_PER_PAGE = 8;

interface CategoryProductsProps {
  initialCategorySlug?: string;
}

export const CategoryProducts: React.FC<CategoryProductsProps> = ({ initialCategorySlug }) => {
  const params = useParams();
  const router = useRouter();
  const cart = useCart();

  // Determine current active category from props, params, or default "all"
  const slugFromParam = (params?.slug as string) || initialCategorySlug || "all";
  
  const [selectedCategory, setSelectedCategory] = useState<string>(slugFromParam);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Sync state if URL param changes
  useEffect(() => {
    if (params?.slug) {
      setSelectedCategory(params.slug as string);
      setCurrentPage(1);
    }
  }, [params?.slug]);

  // Handle category tab change
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
    if (slug === "all") {
      router.push("/category");
    } else {
      router.push(`/category/${slug}`);
    }
  };

  // Reset page to 1 whenever filters change
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handlePriceChange = (val: string) => {
    setPriceFilter(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setPriceFilter("all");
    setSortBy("featured");
    setSelectedCategory("all");
    setCurrentPage(1);
    router.push("/category");
  };

  // Find active category metadata
  const currentCategoryObj = CATEGORIES.find((c) => c.slug === selectedCategory);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      // 1. Category Filter
      if (selectedCategory !== "all") {
        const prodCat = product.category.trim().toLowerCase();
        const catName = currentCategoryObj ? currentCategoryObj.name.trim().toLowerCase() : "";
        const catSlug = currentCategoryObj ? currentCategoryObj.slug.trim().toLowerCase() : selectedCategory.toLowerCase();
        
        const isMatch = prodCat === catName || prodCat === catSlug || (catName && (prodCat.includes(catName) || catName.includes(prodCat)));
        if (!isMatch) {
          return false;
        }
      }

      // 2. Search Term Filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesWeight = product.weight.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        if (!matchesName && !matchesWeight && !matchesCat) {
          return false;
        }
      }

      // 3. Price Filter
      if (priceFilter === "under-50" && product.price >= 50) return false;
      if (priceFilter === "50-100" && (product.price < 50 || product.price > 100)) return false;
      if (priceFilter === "100-200" && (product.price < 100 || product.price > 200)) return false;
      if (priceFilter === "above-200" && product.price <= 200) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name-az") return a.name.localeCompare(b.name);
      return 0; // "featured" keep default order
    });
  }, [selectedCategory, currentCategoryObj, searchTerm, priceFilter, sortBy]);

  // Pagination Math
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentItems = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 320, behavior: "smooth" });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    cart.addToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1200);
  };

  return (
    <div className="bg-gray-50/60 min-h-screen py-8 sm:py-12 font-sans font-normal text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-normal text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/category" className="hover:text-black transition-colors">
            Categories
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            {currentCategoryObj ? currentCategoryObj.name : "All Products"}
          </span>
        </div>

        {/* Category Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-900 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-yellow-700" />
              <span>Bilariyaganj Local Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {currentCategoryObj ? currentCategoryObj.name : "All Daily Essentials"}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-normal max-w-xl">
              Fresh stock sourced from trusted Bilariyaganj mandis and verified shops. Fast 15–30 minute delivery to your doorstep.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-sm text-gray-600 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200">
            <ShoppingBag className="w-4 h-4 text-brand-red" />
            <span>
              Showing <strong className="text-gray-900 font-semibold">{totalItems}</strong> Products
            </span>
          </div>
        </div>

        {/* Horizontal Category Pill Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === "all"
                ? "bg-gray-950 text-white shadow-xs"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
            }`}
          >
            All Products
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-[#fdd602] text-gray-950 font-semibold shadow-xs"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Filters & Sorting Control Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Within Products */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search in this category (Rice, Milk, Aloo...)"
              className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 text-xs sm:text-sm font-normal rounded-xl pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
          </div>

          {/* Price & Sort Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-500 hidden sm:block" />
              <select
                value={priceFilter}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-800 text-xs sm:text-sm rounded-xl px-3 py-2.5 font-normal focus:outline-none focus:ring-2 focus:ring-[#fdd602] cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under-50">Under ₹50</option>
                <option value="50-100">₹50 – ₹100</option>
                <option value="100-200">₹100 – ₹200</option>
                <option value="above-200">Above ₹200</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-800 text-xs sm:text-sm rounded-xl px-3 py-2.5 font-normal focus:outline-none focus:ring-2 focus:ring-[#fdd602] cursor-pointer"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
              </select>
            </div>

            {/* Reset Button (Only if filters active) */}
            {(searchTerm || priceFilter !== "all" || sortBy !== "featured" || selectedCategory !== "all") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm text-gray-600 hover:text-brand-red bg-gray-100 hover:bg-gray-200 transition-colors font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {currentItems.map((product) => {
              const isAdded = addedProductId === product.id;
              const inCart = cart.cartItemsMap[product.id] || 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-gray-200 shadow-xs hover:shadow-card hover:border-gray-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Product Content Container */}
                  <div>
                    {/* Clickable Image to Product Preview Page */}
                    <Link
                      href={`/product/${product.id}`}
                      className="block relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 mb-3 flex items-center justify-center border border-gray-100 cursor-pointer"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-108 transition-transform duration-500"
                      />
                    </Link>

                    {/* Left-Aligned Product Details */}
                    <div className="text-left space-y-0.5 mb-2.5">
                      <Link href={`/product/${product.id}`} className="block">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-brand-red transition-colors line-clamp-1 tracking-tight cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-[11px] sm:text-xs text-gray-500 font-normal">
                        {product.weight}
                      </p>

                      {/* Price */}
                      <div className="pt-0.5 flex items-baseline justify-start gap-1.5 text-left">
                        <span className="text-base sm:text-lg font-bold text-gray-950">
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
                    type="button"
                    onClick={(e) => handleQuickAdd(e, product)}
                    className={`w-full py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-xs cursor-pointer ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-brand-red hover:bg-brand-red-hover text-white active:scale-95"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Added!</span>
                      </>
                    ) : inCart > 0 ? (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>In Cart ({inCart})</span>
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
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/90 shadow-xs space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
              <Filter className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">No Products Found</h3>
              <p className="text-sm text-gray-500 font-normal">
                No items match your selected filters in &ldquo;{currentCategoryObj?.name || "All Products"}&rdquo;.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-full bg-[#fdd602] hover:bg-[#FFE600] text-gray-950 font-medium text-sm transition-all shadow-xs cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-gray-500 font-normal">
              Showing <strong className="text-gray-900 font-medium">{startIndex + 1}</strong>–
              <strong className="text-gray-900 font-medium">{endIndex}</strong> of{" "}
              <strong className="text-gray-900 font-medium">{totalItems}</strong> products
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Prev Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 sm:px-3 sm:py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline font-normal">Previous</span>
              </button>

              {/* Page Number Pills */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#fdd602] text-gray-950 font-semibold shadow-xs"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 sm:px-3 sm:py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline font-normal">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
