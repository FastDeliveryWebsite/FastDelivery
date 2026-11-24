import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - Fast Delivery Bilariyaganj",
  description: "Confirm and place your grocery order for 15-30 minute fast doorstep delivery in Bilariyaganj.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
