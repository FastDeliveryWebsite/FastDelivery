import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-brand-red mb-4">
        <ShoppingBag className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-black text-gray-900 mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-500 max-w-sm mb-6 text-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-bold px-6 py-3 rounded-full transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Fast Delivery Home</span>
      </Link>
    </div>
  );
}
