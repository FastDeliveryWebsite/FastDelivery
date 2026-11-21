import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { CategoryBar } from "@/components/CategoryBar";
import { CategoryProducts } from "@/components/CategoryProducts";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export default function CategoryDetailPage() {
  return (
    <CartProvider>
      <main className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <CategoryBar />
        <CategoryProducts />
        <Footer />
        <CartDrawer />
      </main>
    </CartProvider>
  );
}
