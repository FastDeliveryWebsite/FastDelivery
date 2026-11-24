import { Navbar } from "@/components/Navbar";
import { CategoryBar } from "@/components/CategoryBar";
import { AboutUs } from "@/components/AboutUs";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <CategoryBar />
      <AboutUs />
      <Footer />
      <CartDrawer />
    </main>
  );
}
