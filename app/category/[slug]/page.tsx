import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { CategoryBar } from "@/components/CategoryBar";
import { CategoryProducts } from "@/components/CategoryProducts";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export default function CategoryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <CartProvider>
      <main className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <CategoryBar />
        <CategoryProducts initialCategorySlug={params?.slug} />
        <Footer />
        <CartDrawer />
      </main>
    </CartProvider>
  );
}
