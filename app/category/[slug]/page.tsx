import { Suspense } from "react";
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
    <main className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <CategoryBar />
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-gray-500 font-medium">Loading category...</div>}>
        <CategoryProducts initialCategorySlug={params?.slug} />
      </Suspense>
      <Footer />
      <CartDrawer />
    </main>
  );
}
