"use client";

import React, { createContext, useContext, useState, useMemo, useRef } from "react";
import { Sparkles, X } from "lucide-react";
import { Product } from "@/data/mockData";
import { CartItem } from "@/components/CartDrawer";

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartItemsMap: Record<string, number>;
  isCartOpen: boolean;
  isOrderModalOpen: boolean;
  activeCategory: string | null;
  toastMessage: string | null;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  openCart: () => void;
  closeCart: () => void;
  openOrderModal: () => void;
  closeOrderModal: () => void;
  proceedToCheckout: () => void;
  orderSuccess: () => void;
  setActiveCategory: (category: string | null) => void;
  scrollToProducts: () => void;
  showToast: (message?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartItemsMap = useMemo(() => {
    return cartItems.reduce<Record<string, number>>((acc, item) => {
      acc[item.product.id] = item.quantity;
      return acc;
    }, {});
  }, [cartItems]);

  const showToast = (message?: string) => {
    const msg = message || "Coming Soon! WhatsApp order support will be available shortly.";
    setToastMessage(msg);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openOrderModal = () => setIsOrderModalOpen(false); // Temporarily stopped
  const closeOrderModal = () => setIsOrderModalOpen(false);

  const proceedToCheckout = () => {
    setIsOrderModalOpen(false);
  };

  const orderSuccess = () => {
    setCartItems([]);
    setIsOrderModalOpen(false);
  };

  const scrollToProducts = () => {
    const el = document.getElementById("products-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartItemsMap,
        isCartOpen,
        isOrderModalOpen,
        activeCategory,
        toastMessage,
        addToCart,
        updateQuantity,
        removeItem,
        openCart,
        closeCart,
        openOrderModal,
        closeOrderModal,
        proceedToCheckout,
        orderSuccess,
        setActiveCategory,
        scrollToProducts,
        showToast,
      }}
    >
      {children}

      {/* Global Toast Notification Component */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 pointer-events-auto px-4 w-full max-w-md">
          <div className="bg-[#0c0d10] text-white px-4 sm:px-5 py-3 rounded-2xl shadow-2xl border border-gray-700/80 flex items-center justify-between gap-3 mx-auto">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#fdd602]/20 text-[#fdd602] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-100 truncate sm:whitespace-normal">
                {toastMessage}
              </p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
