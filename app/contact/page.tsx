import { Navbar } from "@/components/Navbar";
import { CategoryBar } from "@/components/CategoryBar";
import { ContactUs } from "@/components/ContactUs";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <CategoryBar />
      <ContactUs />
      <Footer />
      <CartDrawer />
    </main>
  );
}
