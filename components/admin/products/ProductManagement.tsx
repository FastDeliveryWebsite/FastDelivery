"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package, 
  Loader2, 
  AlertCircle,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from "lucide-react";
import { ProductModal, ProductItem } from "./ProductModal";
import { CategoryItem } from "@/components/admin/categories/CategoryModal";

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch {
      // Fallback
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setErrorMessage(data.message || "Failed to load products.");
      }
    } catch {
      setErrorMessage("Network error: Could not fetch products from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    fetchCategories();
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: ProductItem) => {
    fetchCategories();
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (prodData: ProductItem) => {
    const isEdit = Boolean(prodData.id);
    const url = isEdit
      ? `/api/admin/products/${prodData.id}`
      : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prodData),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to save product.");
    }

    await fetchProducts();
  };

  const handleDeleteProduct = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete product.");
      } else {
        await fetchProducts();
      }
    } catch {
      alert("Network error: Could not delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever search or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.weight.toLowerCase().includes(searchTerm.toLowerCase());

    const normSelected = selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normProdCat = (p.category_name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    const matchesCategory =
      selectedCategory === "all" ||
      p.category_id === selectedCategory ||
      p.category_name === selectedCategory ||
      p.category_name?.toLowerCase() === selectedCategory.toLowerCase() ||
      (normSelected && normSelected === normProdCat);

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 160, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header & Actions */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-brand-red text-xs font-semibold mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>Products Inventory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-950">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            Manage your store catalog, pricing, ImageKit media, and specifications
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover active:scale-95 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name or weight..."
            className="w-full bg-gray-50 text-xs sm:text-sm rounded-xl pl-9 pr-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 hidden sm:block" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 text-xs sm:text-sm rounded-xl px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] cursor-pointer w-full sm:w-auto"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id || c.slug} value={c.id || c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl shrink-0">
            Total: {products.length}
          </span>
        </div>

      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-brand-red flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-gray-200/90 p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-7 h-7 animate-spin text-brand-red" />
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Loading products from database...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200/90 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-800">No products found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== "all"
              ? "No products match your search or category filter."
              : "No products added in the database yet. Click below to add your first product!"}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-red px-3.5 py-2 rounded-xl hover:bg-brand-red-hover"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      ) : (
        /* Products Grid & Dynamic Pagination */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 border border-gray-200/90 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative w-full aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden mb-3">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}

                    {/* Category Pill Tag */}
                    <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
                      {product.category_name || "Uncategorized"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-normal">
                      {product.weight}
                    </p>

                    <div className="pt-1 flex items-baseline gap-1.5">
                      <span className="text-base sm:text-lg font-bold text-gray-950">
                        ₹{product.price}
                      </span>
                      {product.original_price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.original_price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Specifications Pill Summary */}
                  {Array.isArray(product.specifications) && product.specifications.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1">
                      {product.specifications.slice(0, 2).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                        >
                          {s.label}: {s.value}
                        </span>
                      ))}
                      {product.specifications.length > 2 && (
                        <span className="text-[10px] text-gray-400">
                          +{product.specifications.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-normal">
                    ID: {product.id ? product.id.substring(0, 8) : "local"}...
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(product)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      title="Edit product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={deletingId === product.id}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-red hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Delete product"
                    >
                      {deletingId === product.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-brand-red" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Dynamic Pagination Bar */}
          {totalPages > 1 && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-gray-500 font-normal text-center sm:text-left">
                Showing <strong className="text-gray-900 font-semibold">{filteredProducts.length === 0 ? 0 : startIndex + 1}</strong> to{" "}
                <strong className="text-gray-900 font-semibold">{endIndex}</strong> of{" "}
                <strong className="text-gray-900 font-semibold">{filteredProducts.length}</strong> products
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      currentPage === page
                        ? "bg-brand-red text-white shadow-xs"
                        : "border border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <ProductModal
          key={editingProduct?.id || "new"}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          categories={categories}
          initialData={editingProduct}
        />
      )}

    </div>
  );
};
