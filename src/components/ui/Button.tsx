"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  glow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    glow = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;

    // Build class names dynamically to avoid conflicts
    const baseClasses = [
      "relative inline-flex items-center justify-center gap-2",
      "font-medium transition-all duration-180",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "overflow-hidden group"
    ];

    // Size classes
    const sizeClasses = {
      xs: "px-2 py-1 text-xs rounded-md min-h-6",
      sm: "px-3 py-1.5 text-sm rounded-md min-h-8", 
      md: "px-4 py-2 text-sm rounded-lg min-h-10",
      lg: "px-6 py-3 text-base rounded-lg min-h-12",
      xl: "px-8 py-4 text-lg rounded-xl min-h-14"
    };

    // Variant classes
    const variantClasses = {
      primary: [
        "bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg",
        "focus:ring-accent-primary focus:ring-offset-bg-default",
        !isDisabled && "hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
      ],
      secondary: [
        "bg-gradient-to-r from-accent-secondary to-purple-600 text-white shadow-lg", 
        "focus:ring-accent-secondary focus:ring-offset-bg-default",
        !isDisabled && "hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
      ],
      tertiary: [
        "bg-accent-tertiary text-black shadow-lg",
        "focus:ring-accent-tertiary focus:ring-offset-bg-default",
        !isDisabled && "hover:bg-lime-500 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
      ],
      outline: [
        "border-2 border-border-default bg-transparent text-text-primary",
        "focus:ring-accent-primary focus:ring-offset-bg-default",
        !isDisabled && "hover:border-accent-primary hover:text-accent-primary hover:bg-state-hover"
      ],
      ghost: [
        "bg-transparent text-text-primary",
        "focus:ring-accent-primary focus:ring-offset-bg-default", 
        !isDisabled && "hover:bg-state-hover hover:text-accent-primary"
      ],
      destructive: [
        "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
        "focus:ring-red-500 focus:ring-offset-bg-default",
        !isDisabled && "hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
      ]
    };

    // Glow classes
    const glowClasses = [];
    if (glow) {
      if (variant === 'primary' || variant === 'secondary') {
        glowClasses.push("shadow-glow");
      }
      if (!isDisabled) {
        if (variant === 'secondary') glowClasses.push("hover:shadow-glow-purple");
        if (variant === 'tertiary') glowClasses.push("hover:shadow-glow-lime");
      }
    }

    const allClasses = [
      ...baseClasses,
      sizeClasses[size],
      ...variantClasses[variant].filter(Boolean),
      fullWidth && "w-full",
      ...glowClasses
    ].filter(Boolean);

    return (
      <button
        className={cn(allClasses, className)}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {/* Background animation overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {variant === 'primary' && (
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-inherit" />
          )}
          {variant === 'secondary' && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-inherit" />
          )}
        </div>
        
        {/* Content */}
        <div className="relative flex items-center justify-center gap-2">
          {/* Loading spinner */}
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-transparent border-t-current" />
          )}
          
          {/* Left icon */}
          {icon && iconPosition === 'left' && !loading && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          
          {/* Button text */}
          {children && (
            <span className={cn(
              "transition-all duration-180",
              { "opacity-0": loading && !icon }
            )}>
              {children}
            </span>
          )}
          
          {/* Right icon */}
          {icon && iconPosition === 'right' && !loading && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 overflow-hidden rounded-inherit">
          <div className="absolute inset-0 opacity-0 group-active:opacity-30 transition-opacity duration-150 bg-white rounded-inherit" />
        </div>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;