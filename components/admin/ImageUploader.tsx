"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, RefreshCw } from "lucide-react";

interface ImageUploaderProps {
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
  folder?: "categories" | "products" | "general";
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onUploadSuccess,
  folder = "products",
  label = "Upload Image",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl ? currentImageUrl.trim() : null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview whenever currentImageUrl prop changes
  useEffect(() => {
    setPreview(currentImageUrl ? currentImageUrl.trim() : null);
  }, [currentImageUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    // Size limit check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB. Please choose a smaller image.");
      return;
    }

    setError(null);
    setIsUploading(true);

    // Show temporary local preview while uploading
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Upload failed");
      }

      setPreview(data.url);
      onUploadSuccess(data.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image. Please try again.");
      setPreview(currentImageUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onUploadSuccess("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">
          {label} <span className="text-gray-400 font-normal">(ImageKit Storage)</span>
        </label>
        {preview && (
          <span className="text-[11px] text-emerald-600 font-medium">
            ✓ Image Attached
          </span>
        )}
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[140px] ${
          preview
            ? "border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/30"
            : "border-gray-300 bg-gray-50/70 hover:border-brand-red hover:bg-red-50/20"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        {preview ? (
          <div className="relative w-full flex flex-col items-center justify-center py-2 space-y-2">
            <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs group">
              <Image
                src={preview}
                alt="Uploaded preview"
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium gap-1">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="text-[11px] font-medium text-gray-600 hover:text-brand-red bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Change Image</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="text-[11px] font-medium text-red-600 hover:text-red-700 bg-white px-2 py-1 rounded-lg border border-red-200 shadow-xs flex items-center gap-1 cursor-pointer"
                title="Remove image"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>

            {isUploading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 rounded-xl z-10">
                <Loader2 className="w-6 h-6 animate-spin text-brand-red" />
                <span className="text-xs font-semibold text-gray-700">Uploading to ImageKit...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-4 space-y-2">
            <div className="w-10 h-10 rounded-full bg-red-50 text-brand-red flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <UploadCloud className="w-5 h-5" />
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-800">
                {isUploading ? "Uploading to ImageKit..." : "Click to upload or drag & drop"}
              </p>
              <p className="text-[11px] text-gray-400">PNG, JPG, or WEBP (up to 5MB)</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-brand-red font-medium flex items-center gap-1">
          <span>&bull;</span> {error}
        </p>
      )}
    </div>
  );
};
