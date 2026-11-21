"use client";

import React from "react";
import { CartItem } from "./CartDrawer";

interface OrderModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  cartItems?: CartItem[];
  onOrderSuccess?: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = () => {
  // Order module temporarily stopped by user request — only Add to Cart active
  return null;
};
