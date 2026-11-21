"use client";

import React from "react";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Product } from "@/data/mockData";
import { useCart } from "@/context/CartContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  items?: CartItem[];
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveItem?: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  items: propItems,
  onUpdateQuantity: propOnUpdateQuantity,
  onRemoveItem: propOnRemoveItem,
}) => {
  const cart = useCart();

  const isOpen = propIsOpen !== undefined ? propIsOpen : cart.isCartOpen;
  const onClose = propOnClose || cart.closeCart;
  const items = propItems || cart.cartItems;
  const onUpdateQuantity = propOnUpdateQuantity || cart.updateQuantity;
  const onRemoveItem = propOnRemoveItem || cart.removeItem;

  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-zinc-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-6 h-6 text-[#fdd602]" />
              <h2 className="text-xl font-black">Your Cart ({items.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-500 space-y-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <p className="text-lg font-black text-gray-800">Your cart is empty</p>
                <p className="text-sm sm:text-base text-gray-500 max-w-xs font-medium">
                  Add daily essentials like Sugar, Milk, or Rice to get started!
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-3 sm:gap-4 items-center">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-black text-gray-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-600 font-bold">{item.product.weight}</p>
                    <p className="text-base sm:text-lg font-black text-gray-950 mt-1">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg p-1 bg-gray-50">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 text-gray-600 hover:text-brand-red rounded hover:bg-white transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-7 text-center text-sm font-black text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 text-gray-600 hover:text-emerald-600 rounded hover:bg-white transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 text-gray-400 hover:text-brand-red rounded-lg transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer: Cart Total Only (No button, No delivery line) */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center font-black text-gray-950 text-xl">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
