"use client";

import { useRef, useState } from "react";
import Surface from "@/components/ui/Surface";
import Button from "@/components/ui/Button";

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
    <Surface variant="elevated" padding="lg" radius="xl" border className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <Surface
          variant="glass"
          padding="md"
          radius="full"
          className="w-16 h-16 flex items-center justify-center mx-auto mb-6 gradient-web3-primary shadow-glow"
        >
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
        </Surface>
        
        <h2 className="text-3xl font-bold text-text-primary mb-2">
          Upload Your Image
        </h2>
        <p className="text-text-secondary">Step 1: Choose or drag your file</p>
      </div>

      {/* Upload Area */}
      <Surface
        variant="glass"
        padding="xl"
        radius="lg"
        border
        className={`
          text-center transition-all duration-300 cursor-pointer
          border-2 border-dashed backdrop-blur-md
          ${dragActive
            ? "border-accent-primary bg-state-active scale-105 shadow-glow"
            : "border-border-default hover:border-accent-primary hover:bg-state-hover"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
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

        {/* Upload Icon */}
        <Surface
          variant={dragActive ? "elevated" : "default"}
          padding="lg"
          radius="full"
          className={`
            inline-flex items-center justify-center w-20 h-20 mb-6 transition-all duration-300
            ${dragActive
              ? "gradient-web3-primary scale-110 shadow-glow text-white"
              : "bg-bg-elevated border-2 border-border-default text-text-muted"
            }
          `}
        >
          <svg
            className="w-10 h-10 transition-all duration-300"
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
        </Surface>

        {/* Upload Text */}
        <div className="space-y-3">
          <p className={`text-xl font-semibold transition-colors duration-300 ${
            dragActive ? "text-accent-primary" : "text-text-primary"
          }`}>
            {dragActive
              ? "Drop your image here!"
              : "Click to upload or drag and drop"}
          </p>
          <p className="text-text-muted text-sm">PNG, JPG, GIF up to 10MB</p>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Surface
              variant="glass"
              padding="sm"
              radius="full"
              className="px-3 py-1 text-xs font-medium text-accent-primary border border-accent-primary/30 backdrop-blur-sm"
            >
              High Quality
            </Surface>
            <Surface
              variant="glass"
              padding="sm"
              radius="full"
              className="px-3 py-1 text-xs font-medium text-accent-tertiary border border-accent-tertiary/30 backdrop-blur-sm"
            >
              Fast Upload
            </Surface>
            <Surface
              variant="glass"
              padding="sm"
              radius="full"
              className="px-3 py-1 text-xs font-medium text-accent-secondary border border-accent-secondary/30 backdrop-blur-sm"
            >
              Secure
            </Surface>
          </div>
        </div>
      </Surface>

      {/* Alternative Upload Button */}
      <div className="mt-8 text-center">
        <p className="text-text-muted text-sm mb-4">Or browse from your device</p>
        <Button
          variant="outline"
          size="lg"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Browse Files
        </Button>
      </div>
    </Surface>
  );
}
