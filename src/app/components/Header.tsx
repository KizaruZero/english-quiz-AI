"use client";

import Button from '@/components/ui/Button';
import Surface from '@/components/ui/Surface';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface HeaderProps {
  currentPage: "home" | "image-description" | "speaking" | "writing";
  onPageChange: (
    page: "home" | "image-description" | "speaking" | "writing"
  ) => void;
}

export default function Header({ currentPage, onPageChange }: HeaderProps) {
  return (
    <Surface 
      as="header" 
      variant="glass" 
      padding="none"
      className="sticky top-0 z-50 backdrop-blur-md border-b border-border-subtle"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div
            className="flex items-center space-x-4 cursor-pointer group"
            onClick={() => onPageChange("home")}
          >
            <div className="text-2xl font-bold text-gradient">
              🎯 PTE Practice Hub
            </div>
            <div className="hidden md:block text-sm text-text-muted group-hover:text-text-secondary transition-colors">
              AI-Powered English Test Preparation
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            <Button
              variant={currentPage === "home" ? "primary" : "ghost"}
              size="sm"
              onClick={() => onPageChange("home")}
              glow={currentPage === "home"}
            >
              Home
            </Button>
            <Button
              variant={currentPage === "image-description" ? "primary" : "ghost"}
              size="sm"
              onClick={() => onPageChange("image-description")}
              glow={currentPage === "image-description"}
            >
              <span className="hidden sm:inline">Image Description</span>
              <span className="sm:hidden">📷</span>
            </Button>
            <Button
              variant={currentPage === "speaking" ? "primary" : "ghost"}
              size="sm"
              onClick={() => onPageChange("speaking")}
              glow={currentPage === "speaking"}
            >
              <span className="hidden sm:inline">Speaking Test</span>
              <span className="sm:hidden">🎤</span>
            </Button>
            <Button
              variant={currentPage === "writing" ? "primary" : "ghost"}
              size="sm"
              onClick={() => onPageChange("writing")}
              glow={currentPage === "writing"}
            >
              <span className="hidden sm:inline">Writing Test</span>
              <span className="sm:hidden">✍️</span>
            </Button>
          </nav>

          {/* Right Section - Theme Toggle & User Info */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle size="sm" />
            
            {/* User Info */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-sm text-text-secondary">
                Welcome,{" "}
                <span className="font-medium text-accent-primary">KizaruZero</span>
              </div>
              <Surface
                variant="elevated"
                padding="none"
                radius="full"
                className="w-10 h-10 flex items-center justify-center gradient-web3-primary text-white font-medium text-sm shadow-glow"
              >
                KZ
              </Surface>
            </div>

            {/* Mobile User Avatar */}
            <Surface
              variant="elevated"
              padding="none"
              radius="full"
              className="md:hidden w-10 h-10 flex items-center justify-center gradient-web3-primary text-white font-medium text-sm shadow-glow"
            >
              KZ
            </Surface>
          </div>
        </div>
      </div>
    </Surface>
  );
}
