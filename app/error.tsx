"use client";

import React, { useEffect } from "react";
import { RefreshCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Something went wrong!</h2>
        <p className="text-sm text-gray-600 mb-6">
          An unexpected error occurred while loading Fast Delivery.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-bold px-6 py-3 rounded-full transition-all"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
