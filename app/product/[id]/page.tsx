import { Navbar } from "@/components/Navbar";
import { CategoryBar } from "@/components/CategoryBar";
import { ProductPreview } from "@/components/ProductPreview";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export default function ProductDetailPage() {
  return (
    <main className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <CategoryBar />
      <ProductPreview />
      <Footer />
      <CartDrawer />
    </main>
  );
}
