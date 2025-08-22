"use client";

import { useState } from "react";
import Button from '@/components/ui/Button';
import Surface from '@/components/ui/Surface';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LoginModal from '@/components/ui/LoginModal';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  currentPage: "home" | "image-description" | "speaking" | "writing";
  onPageChange: (
    page: "home" | "image-description" | "speaking" | "writing"
  ) => void;
}

export default function Header({ currentPage, onPageChange }: HeaderProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    onPageChange("home");
  };

  const getUserInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
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
                disabled={!isAuthenticated}
              >
                <span className="hidden sm:inline">Image Description</span>
                <span className="sm:hidden">📷</span>
              </Button>
              <Button
                variant={currentPage === "speaking" ? "primary" : "ghost"}
                size="sm"
                onClick={() => onPageChange("speaking")}
                glow={currentPage === "speaking"}
                disabled={!isAuthenticated}
              >
                <span className="hidden sm:inline">Speaking Test</span>
                <span className="sm:hidden">🎤</span>
              </Button>
              <Button
                variant={currentPage === "writing" ? "primary" : "ghost"}
                size="sm"
                onClick={() => onPageChange("writing")}
                glow={currentPage === "writing"}
                disabled={!isAuthenticated}
              >
                <span className="hidden sm:inline">Writing Test</span>
                <span className="sm:hidden">✍️</span>
              </Button>
            </nav>

            {/* Right Section - Theme Toggle & User Info */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle size="sm" />
              
              {/* Authentication Section */}
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  {/* Welcome Message - Hidden on mobile */}
                  <div className="hidden md:block text-sm text-text-secondary">
                    Welcome,{" "}
                    <span className="font-medium text-accent-primary">{user.username}</span>
                  </div>
                  
                  {/* User Menu */}
                  <div className="relative">
                    <Surface
                      variant="elevated"
                      padding="none"
                      radius="full"
                      interactive
                      className="w-10 h-10 flex items-center justify-center gradient-web3-primary text-white font-medium text-sm shadow-glow cursor-pointer"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      {getUserInitials(user.username)}
                    </Surface>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                      <Surface
                        variant="glass"
                        padding="sm"
                        radius="lg"
                        border
                        className="absolute right-0 top-12 w-48 backdrop-blur-md z-10"
                      >
                        <div className="py-2">
                          <div className="px-3 py-2 border-b border-border-subtle mb-2">
                            <p className="text-sm font-medium text-text-primary">{user.username}</p>
                            <p className="text-xs text-text-muted">
                              Signed in {new Date(user.loginTime).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            fullWidth
                            onClick={handleLogout}
                            className="justify-start"
                            icon={
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            }
                          >
                            Sign Out
                          </Button>
                        </div>
                      </Surface>
                    )}
                  </div>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  glow
                  onClick={() => setShowLoginModal(true)}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Click outside to close user menu */}
        {showUserMenu && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </Surface>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}
