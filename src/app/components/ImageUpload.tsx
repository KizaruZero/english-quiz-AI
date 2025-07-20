"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  onImageUpload: (file: File, preview: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({
  onImageUpload,
  disabled,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onImageUpload(file, preview);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    handleFiles(e.target.files);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Upload Your Image
        </h2>
        <p className="text-gray-600">Step 1: Choose or drag your file</p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
          dragActive
            ? "border-indigo-500 bg-indigo-50 scale-105"
            : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-gray-500">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-300 ${
              dragActive
                ? "bg-indigo-600 scale-110"
                : "bg-gray-100 border-2 border-gray-200"
            }`}
          >
            <svg
              className={`w-10 h-10 transition-all duration-300 ${
                dragActive ? "text-white scale-110" : "text-gray-400"
              }`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="space-y-3">
            <p
              className={`text-xl font-semibold transition-colors duration-300 ${
                dragActive ? "text-indigo-600" : "text-gray-700"
              }`}
            >
              {dragActive
                ? "Drop your image here!"
                : "Click to upload or drag and drop"}
            </p>
            <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                High Quality
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full border border-green-200">
                Fast Upload
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full border border-purple-200">
                Secure
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
