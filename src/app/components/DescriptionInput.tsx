"use client";

import { useState } from "react";

interface DescriptionInputProps {
  imagePreview: string;
  onSubmit: (description: string) => void;
  disabled?: boolean;
}

export default function DescriptionInput({
  imagePreview,
  onSubmit,
  disabled,
}: DescriptionInputProps) {
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 10) {
      alert("Please provide a description with at least 10 characters");
      return;
    }
    onSubmit(description.trim());
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Step 2: Describe the Image
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Your Image:
          </h3>
          <img
            src={imagePreview}
            alt="Uploaded image"
            className="w-full rounded-lg shadow-md object-cover max-h-80"
          />
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="description"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Your Description:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you see in the image in detail..."
                className="w-full h-40 p-4 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                disabled={disabled}
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Characters: {description.length} (minimum 50)
              </p>
            </div>

            <button
              type="submit"
              disabled={disabled || description.trim().length < 10}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {disabled ? "Analyzing..." : "Submit Description"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
