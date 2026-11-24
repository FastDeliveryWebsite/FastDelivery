"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  Search, 
  ShoppingCart, 
  X, 
  Plus, 
  Check, 
  Menu, 
  Info, 
  PhoneCall, 
  MessageCircle 
} from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ALL_PRODUCTS, Product } from "@/data/mockData";
import { 
  LogIn, 
  User, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown,
  ShoppingBag
} from "lucide-react";

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onSearch?: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount: propCartCount,
  onOpenCart: propOnOpenCart,
  onSearch,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const cart = useCart();
  const auth = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [productsList, setProductsList] = useState<Product[]>(ALL_PRODUCTS);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const cartCount = propCartCount !== undefined ? propCartCount : cart.cartCount;
  const handleOpenCart = propOnOpenCart || cart.openCart;

  useEffect(() => {
    let isMounted = true;
    const fetchNavbarProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProductsList(
            data.products.map((p: any) => ({
              id: p.id,
              name: p.name,
              weight: p.weight || "1 Unit",
              price: Number(p.price),
              originalPrice: p.original_price ? Number(p.original_price) : undefined,
              image: p.image || "/placeholder.png",
              category: p.category_name || "General",
              inStock: true,
            }))
          );
        }
      } catch (err) {
        console.warn("Navbar: using fallback products", err);
      }
    };
    fetchNavbarProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products based on search term
  const searchResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return productsList.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.weight.toLowerCase().includes(q)
    );
  }, [searchTerm, productsList]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setIsDropdownOpen(val.trim().length > 0);
    if (onSearch) onSearch(val);
  };

  const handleClear = () => {
    setSearchTerm("");
    setIsDropdownOpen(false);
    if (onSearch) onSearch("");
  };

  const handleSelectProduct = (product: Product) => {
    setIsDropdownOpen(false);
    setSearchTerm("");
    router.push(`/product/${product.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      handleSelectProduct(searchResults[0]);
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    cart.addToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1200);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigation Links Definition: Only About Us & Contact Us (Home removed per user request)
  const navLinks = [
    { name: "About Us", href: "/about", icon: Info },
    { name: "Contact Us", href: "/contact", icon: PhoneCall },
  ];

  // Reusable Search Dropdown List
  const renderSearchResultsDropdown = () => {
    if (!isDropdownOpen || searchTerm.trim().length === 0) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto text-left">
        {searchResults.length > 0 ? (
          <div>
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs sm:text-sm font-medium text-gray-600">
              <span>Matching Products ({searchResults.length})</span>
              <span className="text-xs text-gray-400 font-normal">Click to preview product</span>
            </div>
            
            <div className="divide-y divide-gray-100">
              {searchResults.map((product) => {
                const isAdded = addedProductId === product.id;
                const inCart = cart.cartItemsMap[product.id] || 0;

                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="p-3 sm:p-4 hover:bg-gray-50/90 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <h4 className="text-sm sm:text-base font-medium text-gray-950 group-hover:text-brand-red transition-colors truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-normal">
                          <span>{product.weight}</span>
                          <span>•</span>
                          <span className="text-gray-600 truncate">{product.category}</span>
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-gray-950 pt-0.5">
                          ₹{product.price}
                          {product.originalPrice && (
                            <span className="text-xs sm:text-sm text-gray-400 line-through font-normal ml-1.5">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className={`px-3.5 py-2 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shrink-0 active:scale-95 cursor-pointer ${
                        isAdded
                          ? "bg-green-600 text-white"
                          : "bg-brand-red hover:bg-brand-red-hover text-white shadow-xs"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[2]" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 stroke-[2]" />
                          <span>{inCart > 0 ? `Add (${inCart})` : "Add"}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-1.5">
            <p className="text-base font-medium text-gray-900">
              No products found for &ldquo;{searchTerm}&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-gray-500 font-normal">
              Try searching for Banana, Rice, Milk, Oil, Masale, Sugar...
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0d10] text-white shadow-md border-b border-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop View (md and above): Single Unified Horizontal Row */}
        <div className="hidden md:flex items-center justify-between h-20 gap-4 lg:gap-6">
          
          {/* Left: Brand Logo (Links to Home) */}
          <Link href="/" className="flex items-center shrink-0 cursor-pointer">
            <Logo variant="light" size="md" />
          </Link>

          {/* Center: Search Bar with Live Working Dropdown */}
          <div ref={desktopSearchRef} className="flex-1 max-w-xl mx-2 lg:mx-4 relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsDropdownOpen(searchTerm.trim().length > 0)}
                placeholder="Search for products (Banana, Rice, Milk, Oil, Masale...)"
                className="w-full bg-white text-gray-900 placeholder-gray-500 text-sm lg:text-base font-normal rounded-full pl-11 pr-10 py-2.5 lg:py-3 focus:outline-none focus:ring-2 focus:ring-[#fdd602] shadow-inner"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
              {searchTerm && (
                <button
                  onClick={handleClear}
                  className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown */}
            {renderSearchResultsDropdown()}
          </div>

          {/* Right: Nav Links (About Us & Contact Us) + Cart Button */}
          <div className="flex items-center gap-3 lg:gap-5 shrink-0">
            <nav className="flex items-center gap-2 lg:gap-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 lg:px-5 py-2.5 rounded-full text-base lg:text-lg transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? "bg-[#fdd602] text-gray-950 font-semibold shadow-xs"
                        : "text-gray-300 hover:text-white font-normal hover:bg-zinc-800/80"
                    }`}
                  >
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="w-px h-6 bg-gray-800" />

            {/* User Account Button with Dropdown (or Login Redirect Icon) */}
            {auth.isAuthenticated ? (
              <div ref={userDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs lg:text-sm font-medium transition-colors cursor-pointer border border-zinc-700/80 active:scale-95"
                  title="Account Menu"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-red text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                  </div>
                  <span className="max-w-[100px] truncate">{auth.user?.name || "Account"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isUserDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {auth.user?.name}
                      </p>
                      <p className="text-[11px] text-gray-500 font-normal truncate">
                        {auth.user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-950 font-medium transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gray-500" />
                        <span>My Dashboard</span>
                      </Link>

                      <Link
                        href="/category"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-950 font-medium transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4 text-gray-500" />
                        <span>Explore Shop</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          auth.logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-brand-red hover:bg-red-50 font-medium transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-gray-300 hover:text-white transition-all flex items-center justify-center cursor-pointer border border-zinc-700/80 active:scale-95 group"
                title="Log In / Register"
              >
                <User className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={handleOpenCart}
              className="relative p-2.5 rounded-full hover:bg-zinc-800 transition-colors flex items-center justify-center text-white group cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6 lg:w-7 lg:h-7 text-white group-hover:scale-105 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs font-semibold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 shadow-md border-2 border-[#0c0d10]">
                {cartCount}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile View (< md): Clean Two-Row Layout without Duplicate Outer Strip */}
        <div className="md:hidden pt-3.5 pb-3">
          
          {/* Row 1: Logo on Left, Menu Toggle + Cart on Right */}
          <div className="flex items-center justify-between">
            <Link href="/" className="cursor-pointer">
              <Logo variant="light" size="sm" />
            </Link>

            <div className="flex items-center gap-2">
              {/* Mobile User Icon: Hidden when user is logged in as requested */}
              {!auth.isAuthenticated && (
                <Link
                  href="/login"
                  className="p-2 rounded-xl bg-zinc-900 border border-gray-800 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                  title="Sign In"
                >
                  <User className="w-5 h-5 text-gray-300" />
                </Link>
              )}

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-zinc-900 border border-gray-800 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#fdd602]" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              {/* Mobile Cart Button */}
              <button
                onClick={handleOpenCart}
                className="relative p-2 rounded-xl bg-zinc-900 border border-gray-800 text-white flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                aria-label="View Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[11px] font-semibold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-0.5 shadow-md border-2 border-[#0c0d10]">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Collapsible Nav Menu (Dropdown Drawer) */}
          {isMobileMenuOpen && (
            <div className="mt-3 p-3.5 bg-zinc-950 border border-gray-800 rounded-2xl shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User Account Info in Mobile Menu when Logged In */}
              {auth.isAuthenticated && (
                <div className="p-3 rounded-xl bg-zinc-900 border border-gray-800 flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-bold text-white truncate">{auth.user?.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{auth.user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xs font-semibold text-[#fdd602] hover:underline shrink-0"
                  >
                    Dashboard →
                  </Link>
                </div>
              )}

              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base sm:text-lg transition-all ${
                      isActive
                        ? "bg-[#fdd602] text-gray-950 font-semibold shadow-xs"
                        : "text-gray-200 hover:bg-zinc-900 hover:text-white font-normal"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-gray-950" : "text-[#fdd602]"}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              <div className="pt-2.5 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400 px-2 font-normal">
                <span>Bilariyaganj Delivery Hub</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    cart.showToast("Coming Soon! WhatsApp support will be available shortly.");
                  }}
                  className="text-[#25D366] font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-[#25D366] text-zinc-950" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          )}

          {/* Row 2: Full-Width Search Bar with Live Working Dropdown */}
          <div ref={mobileSearchRef} className="mt-2.5 relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsDropdownOpen(searchTerm.trim().length > 0)}
                placeholder="Search products (Banana, Rice, Milk...)"
                className="w-full bg-white text-gray-900 placeholder-gray-500 text-sm font-normal rounded-full pl-10 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#fdd602] shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              {searchTerm && (
                <button
                  onClick={handleClear}
                  className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown for Mobile */}
            {renderSearchResultsDropdown()}
          </div>

        </div>

      </div>
    </header>
  );
};
