import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { CategoryBar } from "@/components/CategoryBar";
import { HeroSection } from "@/components/HeroSection";
import { ShopByCategory } from "@/components/ShopByCategory";
import { PopularProducts } from "@/components/PopularProducts";
import { RecentlyAdded } from "@/components/RecentlyAdded";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { HowItWorks } from "@/components/HowItWorks";
// import { WhyChooseUs } from "@/components/WhyChooseUs";
import { CustomerTestimonials } from "@/components/CustomerTestimonials";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { OrderModal } from "@/components/OrderModal";

export default function HomePage() {
  return (
    <CartProvider>
      <main className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <CategoryBar />
        <HeroSection />
        <ShopByCategory />
        <PopularProducts />
        <RecentlyAdded />
        <PromotionalBanner />
        <HowItWorks />
        <CustomerTestimonials />
        {/* <WhyChooseUs /> */}
        <WhatsAppCTA />
        <Footer />
        <CartDrawer />
        <OrderModal />
      </main>
    </CartProvider>
  );
}
