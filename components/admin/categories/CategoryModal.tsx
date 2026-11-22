"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";

export interface CategoryItem {
  id?: string;
  name: string;
  slug: string;
  image?: string | null;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: CategoryItem) => Promise<void>;
  initialData?: CategoryItem | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [image, setImage] = useState<string>(initialData?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSlug(initialData.slug || "");
      setImage(initialData.image || "");
    } else {
      setName("");
      setSlug("");
      setImage("");
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");
    setSlug(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a category name.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        id: initialData?.id,
        name: name.trim(),
        slug: slug.trim(),
        image: image || null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {initialData ? "Edit Category" : "Add New Category"}
            </h2>
            <p className="text-xs text-gray-500 font-normal">
              Store category details and ImageKit banner/icon
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-brand-red font-medium">
              {error}
            </div>
          )}

          {/* Category Name */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-gray-700">
              Category Name <span className="text-brand-red">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Vegetables, Dairy, Grocery"
              required
              className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 text-sm rounded-xl px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all"
            />
          </div>

          {/* Category Slug */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-gray-700">
              URL Slug <span className="text-gray-400 font-normal">(Auto-generated or custom)</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. vegetables"
              className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 text-sm rounded-xl px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all font-mono text-xs"
            />
          </div>

          {/* Category Image (ImageKit Uploader) */}
          <div className="pt-1">
            <ImageUploader
              currentImageUrl={image}
              onUploadSuccess={(url) => setImage(url)}
              folder="categories"
              label="Category Image"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-red hover:bg-brand-red-hover active:scale-95 transition-all flex items-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{initialData ? "Update Category" : "Create Category"}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
