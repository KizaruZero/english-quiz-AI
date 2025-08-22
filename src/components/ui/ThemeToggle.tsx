"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function ThemeToggle({ 
  size = 'md', 
  showLabel = false, 
  className = '' 
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  
  // Use a try-catch to handle cases where ThemeProvider is not available
  let themeContext;
  try {
    themeContext = useTheme();
  } catch (error) {
    // ThemeProvider not available, use fallback
    themeContext = null;
  }

  const theme = themeContext?.theme || 'dark';
  const toggleTheme = themeContext?.toggleTheme || (() => {});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`animate-pulse bg-bg-surface rounded-full ${getSizeClasses(size)}`} />;
  }

  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-text-secondary">
          Theme
        </span>
      )}
      
      <button
        onClick={toggleTheme}
        className={`
          relative inline-flex items-center justify-center
          rounded-full transition-all duration-300 ease-spring
          focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2
          focus:ring-offset-bg-default
          hover:shadow-glow
          ${getSizeClasses(size)}
          ${isDark 
            ? 'bg-gradient-to-r from-accent-primary to-accent-secondary shadow-lg' 
            : 'bg-bg-elevated border border-border-default hover:border-border-strong'
          }
        `}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        {/* Background gradient overlay for light mode */}
        <div 
          className={`
            absolute inset-0 rounded-full opacity-0 transition-opacity duration-300
            bg-gradient-to-r from-accent-primary to-accent-secondary
            ${!isDark ? 'group-hover:opacity-10' : ''}
          `} 
        />
        
        {/* Icon container */}
        <div className="relative flex items-center justify-center">
          {/* Sun icon */}
          <svg
            className={`
              absolute transition-all duration-300 ease-spring
              ${isDark 
                ? 'scale-0 rotate-90 opacity-0' 
                : 'scale-100 rotate-0 opacity-100'
              }
              ${getIconSize(size)}
            `}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          
          {/* Moon icon */}
          <svg
            className={`
              absolute transition-all duration-300 ease-spring text-white
              ${isDark 
                ? 'scale-100 rotate-0 opacity-100' 
                : 'scale-0 -rotate-90 opacity-0'
              }
              ${getIconSize(size)}
            `}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>
        
        {/* Glow effect for dark mode */}
        <div 
          className={`
            absolute inset-0 rounded-full transition-opacity duration-300
            ${isDark 
              ? 'opacity-100 shadow-glow animate-glow-pulse' 
              : 'opacity-0'
            }
          `} 
        />
      </button>
      
      {showLabel && (
        <span className="text-xs text-text-muted capitalize">
          {theme} mode
        </span>
      )}
    </div>
  );
}

function getSizeClasses(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'w-8 h-8';
    case 'md':
      return 'w-10 h-10';
    case 'lg':
      return 'w-12 h-12';
    default:
      return 'w-10 h-10';
  }
}

function getIconSize(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'w-4 h-4';
    case 'md':
      return 'w-5 h-5';
    case 'lg':
      return 'w-6 h-6';
    default:
      return 'w-5 h-5';
  }
}