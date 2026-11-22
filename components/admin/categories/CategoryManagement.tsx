"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  FolderTree, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from "lucide-react";
import { CategoryModal, CategoryItem } from "./CategoryModal";

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const fetchCategories = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setErrorMessage(data.message || "Failed to load categories.");
      }
    } catch {
      setErrorMessage("Network error: Could not fetch categories from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (catData: CategoryItem) => {
    const isEdit = Boolean(catData.id);
    const url = isEdit
      ? `/api/admin/categories/${catData.id}`
      : "/api/admin/categories";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(catData),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to save category.");
    }

    await fetchCategories();
  };

  const handleDeleteCategory = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this category?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete category.");
      } else {
        await fetchCategories();
      }
    } catch {
      alert("Network error: Could not delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredCategories.length);
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

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
            <FolderTree className="w-3.5 h-3.5" />
            <span>Categories Catalog</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-950">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            Create, update, and manage store categories with ImageKit banners
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover active:scale-95 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories by name or slug..."
            className="w-full bg-gray-50 text-xs sm:text-sm rounded-xl pl-9 pr-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fdd602] focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl">
          Total: {categories.length}
        </span>
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
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Loading categories from database...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200/90 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <FolderTree className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-800">No categories found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchTerm
              ? `No categories match "${searchTerm}".`
              : "No categories have been created in the database yet. Click below to add your first category!"}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-red px-3.5 py-2 rounded-xl hover:bg-brand-red-hover"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      ) : (
        /* Categories Table / Card Grid & Pagination */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedCategories.map((category) => (
              <div
                key={category.id || category.slug}
                className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-gray-200/90 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-3.5">
                  {/* Category Image Preview */}
                  <div className="relative w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-base font-bold text-gray-900 truncate">
                      {category.name}
                    </h3>
                    <p className="text-xs font-mono text-gray-400 truncate">
                      /{category.slug}
                    </p>
                    <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      Active
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-normal">
                    ID: {category.id ? category.id.substring(0, 8) : "local"}...
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(category)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      title="Edit category"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={deletingId === category.id}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-red hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Delete category"
                    >
                      {deletingId === category.id ? (
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

          {/* Dynamic Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-gray-500 font-normal text-center sm:text-left">
                Showing <strong className="text-gray-900 font-semibold">{filteredCategories.length === 0 ? 0 : startIndex + 1}</strong> to{" "}
                <strong className="text-gray-900 font-semibold">{endIndex}</strong> of{" "}
                <strong className="text-gray-900 font-semibold">{filteredCategories.length}</strong> categories
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

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

      {/* Category Add/Edit Modal */}
      {isModalOpen && (
        <CategoryModal
          key={editingCategory?.id || "new"}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
          initialData={editingCategory}
        />
      )}

    </div>
  );
};
