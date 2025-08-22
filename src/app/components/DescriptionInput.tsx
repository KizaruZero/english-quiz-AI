"use client";

import { useState } from "react";
import Surface from "@/components/ui/Surface";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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

  const tips = [
    {
      icon: "👁️",
      title: "Observe Details",
      text: "Look at colors, shapes, people, objects, and their relationships"
    },
    {
      icon: "🎯",
      title: "Be Specific",
      text: "Use precise vocabulary and avoid vague descriptions"
    },
    {
      icon: "📝",
      title: "Structure Well",
      text: "Start with general overview, then focus on specific details"
    },
    {
      icon: "⏰",
      title: "Take Your Time",
      text: "Think before writing, quality over speed"
    }
  ];

  return (
    <Surface variant="elevated" padding="lg" radius="xl" border className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <Surface
          variant="glass"
          padding="md"
          radius="full"
          className="w-16 h-16 flex items-center justify-center mx-auto mb-6 gradient-web3-secondary shadow-glow-purple"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </Surface>
        
        <h2 className="text-3xl font-bold text-text-primary mb-2">
          Describe the Image
        </h2>
        <p className="text-text-secondary">Step 2: Share what you see in detail</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Image and Tips */}
        <div className="space-y-6">
          {/* Image Display */}
          <Surface variant="glass" padding="md" radius="lg" border>
            <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-accent-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Your Image
            </h3>
            <div className="overflow-hidden rounded-lg border border-border-default">
              <img
                src={imagePreview}
                alt="Uploaded image"
                className="w-full rounded-lg object-cover max-h-80 transition-transform duration-300 hover:scale-105"
              />
            </div>
          </Surface>

          {/* Tips Section */}
          <Surface variant="glass" padding="lg" radius="lg" border className="backdrop-blur-md">
            <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-accent-tertiary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              Writing Tips
            </h3>
            <div className="grid gap-4">
              {tips.map((tip, index) => (
                <Surface
                  key={index}
                  variant="default"
                  padding="sm"
                  radius="lg"
                  className="flex items-start space-x-3 hover:bg-state-hover transition-colors duration-200"
                >
                  <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                  <div>
                    <h4 className="font-semibold text-text-primary text-sm">{tip.title}</h4>
                    <p className="text-text-muted text-xs mt-1">{tip.text}</p>
                  </div>
                </Surface>
              ))}
            </div>
          </Surface>
        </div>

        {/* Right Column - Form */}
        <div className="space-y-6">
          <Surface variant="glass" padding="lg" radius="lg" border>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-text-primary mb-4">
                  Your Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you see in the image. Include details about objects, people, colors, setting, and any actions taking place..."
                  disabled={disabled}
                  className="w-full h-64 px-4 py-3 rounded-lg border border-border-default bg-bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-180 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="mt-2 flex justify-between items-center">
                  <span className={`text-sm ${
                    description.length < 10 
                      ? "text-red-500" 
                      : description.length < 50 
                        ? "text-yellow-500" 
                        : "text-accent-tertiary"
                  }`}>
                    {description.length} characters
                    {description.length < 10 && " (minimum 10 required)"}
                  </span>
                  <span className="text-xs text-text-muted">
                    Recommended: 100-200 characters
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  glow
                  disabled={disabled || description.trim().length < 10}
                  loading={disabled}
                  className="flex-1"
                >
                  {disabled ? "Analyzing..." : "Submit Description"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setDescription("")}
                  disabled={disabled || !description}
                >
                  Clear
                </Button>
              </div>
            </form>
          </Surface>

          {/* Progress Indicator */}
          <Surface variant="glass" padding="md" radius="lg" border>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Progress</span>
              <span className="text-accent-primary font-medium">Step 2 of 3</span>
            </div>
            <div className="mt-3 flex space-x-2">
              <div className="h-2 flex-1 bg-accent-primary rounded-full"></div>
              <div className="h-2 flex-1 bg-accent-primary rounded-full"></div>
              <div className="h-2 flex-1 bg-border-default rounded-full"></div>
            </div>
          </Surface>

          {/* Quick Actions */}
          <Surface variant="glass" padding="md" radius="lg" border>
            <h4 className="font-semibold text-text-primary mb-3 text-sm">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDescription(prev => prev + " The image shows ")}
                disabled={disabled}
              >
                Add Starter
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDescription(prev => prev + " In the foreground, ")}
                disabled={disabled}
              >
                Foreground
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDescription(prev => prev + " In the background, ")}
                disabled={disabled}
              >
                Background
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDescription(prev => prev + " The colors include ")}
                disabled={disabled}
              >
                Colors
              </Button>
            </div>
          </Surface>
        </div>
      </div>
    </Surface>
  );
}
