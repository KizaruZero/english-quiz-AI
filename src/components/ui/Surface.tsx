"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'overlay' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  border?: boolean;
  glow?: boolean;
  interactive?: boolean;
  as?: React.ElementType;
}

const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({
    className,
    variant = 'default',
    padding = 'md',
    radius = 'lg',
    border = false,
    glow = false,
    interactive = false,
    as: Component = 'div',
    children,
    ...props
  }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          // Base styles
          "transition-all duration-180",
          
          // Variant styles
          {
            // Default - basic surface
            "bg-bg-surface": variant === 'default',
            
            // Elevated - raised surface
            "bg-bg-elevated shadow-md": variant === 'elevated',
            
            // Overlay - modal/dialog background
            "bg-bg-overlay shadow-lg": variant === 'overlay',
            
            // Glass - glassmorphism effect
            "glass": variant === 'glass',
          },
          
          // Padding variants
          {
            "p-0": padding === 'none',
            "p-3": padding === 'sm',
            "p-4": padding === 'md',
            "p-6": padding === 'lg',
            "p-8": padding === 'xl',
          },
          
          // Border radius
          {
            "rounded-none": radius === 'none',
            "rounded-sm": radius === 'sm',
            "rounded-md": radius === 'md',
            "rounded-lg": radius === 'lg',
            "rounded-xl": radius === 'xl',
            "rounded-full": radius === 'full',
          },
          
          // Border
          {
            "border border-border-default": border,
          },
          
          // Interactive states
          {
            "cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]": interactive,
            "hover:border-accent-primary": interactive && border,
          },
          
          // Glow effect
          {
            "shadow-glow": glow,
            "hover:shadow-glow": interactive && glow,
          },
          
          className
        )}
        {...props}
      >
        {children}
        
        {/* Gradient border effect for glass variant */}
        {variant === 'glass' && (
          <div className="absolute inset-0 rounded-inherit border-gradient opacity-30 pointer-events-none" />
        )}
        
        {/* Interactive ripple effect */}
        {interactive && (
          <div className="absolute inset-0 overflow-hidden rounded-inherit">
            <div className="absolute inset-0 opacity-0 group-active:opacity-20 transition-opacity duration-150 bg-accent-primary rounded-inherit" />
          </div>
        )}
      </Component>
    );
  }
);

Surface.displayName = "Surface";

export default Surface;