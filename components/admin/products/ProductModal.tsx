"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Save, Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { CategoryItem } from "@/components/admin/categories/CategoryModal";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductItem {
  id?: string;
  name: string;
  category_id?: string | null;
  category_name: string;
  weight: string;
  price: number;
  original_price?: number | null;
  image: string;
  specifications?: ProductSpec[];
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: ProductItem) => Promise<void>;
  categories: CategoryItem[];
  initialData?: ProductItem | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [categoryName, setCategoryName] = useState(initialData?.category_name || "");
  const [weight, setWeight] = useState(initialData?.weight || "");
  const [price, setPrice] = useState<string>(
    initialData?.price !== undefined && initialData?.price !== null ? String(initialData.price) : ""
  );
  const [originalPrice, setOriginalPrice] = useState<string>(
    initialData?.original_price !== null && initialData?.original_price !== undefined
      ? String(initialData.original_price)
      : ""
  );
  const [image, setImage] = useState<string>(initialData?.image || "");
  const [specs, setSpecs] = useState<ProductSpec[]>(
    Array.isArray(initialData?.specifications) ? initialData.specifications : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      
      // Accurately match category by id or name
      const matchedCat = categories.find(
        (c) =>
          (initialData.category_id && c.id === initialData.category_id) ||
          (initialData.category_name && c.name.toLowerCase() === initialData.category_name.toLowerCase())
      );

      setCategoryId(matchedCat?.id || initialData.category_id || "");
      setCategoryName(matchedCat?.name || initialData.category_name || "");
      setWeight(initialData.weight || "");
      setPrice(initialData.price !== undefined ? String(initialData.price) : "");
      setOriginalPrice(
        initialData.original_price !== null && initialData.original_price !== undefined
          ? String(initialData.original_price)
          : ""
      );
      setImage(initialData.image || "");
      setSpecs(
        Array.isArray(initialData.specifications) ? initialData.specifications : []
      );
    } else {
      setName("");
      // Blank category state for new products (user must explicitly select)
      setCategoryId("");
      setCategoryName("");
      setWeight("");
      setPrice("");
      setOriginalPrice("");
      setImage("");
      setSpecs([]);
    }
    setError(null);
  }, [initialData, categories, isOpen]);

  const handleCategorySelect = (selectedId: string) => {
    setCategoryId(selectedId);
    const matched = categories.find(
      (c) => c.id === selectedId || c.slug === selectedId || c.name === selectedId
    );
    if (matched) {
      setCategoryId(matched.id || selectedId);
      setCategoryName(matched.name);
    } else {
      setCategoryName("");
    }
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { label: "", value: "" }]);
  };

  const handleSpecChange = (index: number, field: "label" | "value", val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a product name.");
      return;
    }

    if (!categoryId || !categoryName.trim()) {
      setError("Please select a category.");
      return;
    }

    if (!price || isNaN(Number(price))) {
      setError("Please enter a valid selling price.");
      return;
    }

    if (!image.trim()) {
      setError("Please upload a product image.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        id: initialData?.id,
        name: name.trim(),
        category_id: categoryId || null,
        category_name: categoryName.trim(),
        weight: weight.trim() || "1 Unit",
        price: Number(price),
        original_price: originalPrice ? Number(originalPrice) : null,
        image: image.trim(),
        specifications: specs.filter((s) => s.label.trim() && s.value.trim()),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {initialData ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-gray-500 font-normal">
              Manage product pricing, details, and specifications
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-brand-red font-medium">
              {error}
            </div>
          )}

          {/* Row 1: Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Product Name */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-gray-700">
                Product Name <span className="text-brand-red">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Basmati Rice, Fresh Tomato"
                required
                className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 text-sm rounded-xl px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all"
              />
            </div>

            {/* Category Select (Fetched from DB) */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-gray-700">
                Category <span className="text-brand-red">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => handleCategorySelect(e.target.value)}
                required
                className="w-full bg-gray-50 text-gray-900 text-sm rounded-xl px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all cursor-pointer"
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id || c.slug} value={c.id || c.slug || ""}>
                    {c.name}
                  </option>
                ))}
                {/* Fallback option if product category is not yet in categories list */}
                {categoryId && !categories.some((c) => (c.id && c.id === categoryId) || (c.slug && c.slug === categoryId)) && (
                  <option value={categoryId}>
                    {categoryName || "Selected Category"}
                  </option>
                )}
              </select>
            </div>

          </div>

          {/* Row 2: Weight & Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Weight / Pack Size */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-gray-700">
                Pack Size / Weight
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 1 Kg, 500g, 1 Dozen"
                className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 text-sm rounded-xl px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all"
              />
            </div>

            {/* Price (₹) */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-gray-700">
                Selling Price (₹) <span className="text-brand-red">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="120"
                required
                className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 text-sm rounded-xl px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all"
              />
            </div>

            {/* Original / MRP Price (₹) */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-gray-700">
                Original MRP (₹) <span className="text-gray-400 font-normal">(Optional strikethrough)</span>
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="150"
                className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 text-sm rounded-xl px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all"
              />
            </div>

          </div>

          {/* Product Image (ImageKit Uploader) */}
          <div className="pt-1">
            <ImageUploader
              currentImageUrl={image}
              onUploadSuccess={(url) => setImage(url)}
              folder="products"
              label="Product Image"
            />
          </div>

          {/* Dynamic Specifications */}
          <div className="space-y-2 text-left pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Product Specifications
                </label>
                <p className="text-[11px] text-gray-400">
                  Add key details shown on product preview page (e.g. Origin, Brand, Shelf Life)
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSpec}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-red hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {specs.map((spec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(index, "label", e.target.value)}
                    placeholder="Feature (e.g. Origin)"
                    className="flex-1 bg-gray-50 text-xs rounded-xl px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602]"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                    placeholder="Detail (e.g. Local Farm)"
                    className="flex-1 bg-gray-50 text-xs rounded-xl px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(index)}
                    className="p-2 text-gray-400 hover:text-brand-red rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
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
                  <span>{initialData ? "Update Product" : "Create Product"}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
