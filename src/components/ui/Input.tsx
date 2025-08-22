"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'outline' | 'ghost';
  inputSize?: 'sm' | 'md' | 'lg';
  error?: boolean;
  success?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  label?: string;
  helperText?: string;
  errorText?: string;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant = 'default',
    inputSize = 'md',
    type = 'text',
    error = false,
    success = false,
    icon,
    iconPosition = 'left',
    label,
    helperText,
    errorText,
    fullWidth = false,
    disabled,
    ...props
  }, ref) => {
    const hasError = error || !!errorText;
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Build class names dynamically to avoid conflicts
    const baseClasses = [
      "w-full transition-all duration-180",
      "placeholder:text-text-muted",
      "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-bg-default",
      "disabled:opacity-50 disabled:cursor-not-allowed"
    ];

    // Size classes
    const sizeClasses = {
      sm: "px-3 py-2 text-sm rounded-md min-h-9",
      md: "px-4 py-2.5 text-sm rounded-lg min-h-10",
      lg: "px-4 py-3 text-base rounded-lg min-h-12"
    };

    // Icon padding classes
    const iconPaddingClasses = [];
    if (icon && iconPosition === 'left') {
      iconPaddingClasses.push(inputSize === 'sm' ? "pl-10" : "pl-11");
    }
    if (icon && iconPosition === 'right') {
      iconPaddingClasses.push(inputSize === 'sm' ? "pr-10" : "pr-11");
    }

    // Variant classes
    const variantClasses = {
      default: [
        "bg-bg-surface border border-border-default text-text-primary",
        !disabled && !hasError && "hover:border-border-strong focus:border-accent-primary",
        !hasError && "focus:ring-accent-primary"
      ],
      filled: [
        "bg-bg-elevated border border-transparent text-text-primary",
        !disabled && !hasError && "hover:bg-bg-overlay focus:bg-bg-surface focus:border-accent-primary",
        !hasError && "focus:ring-accent-primary"
      ],
      outline: [
        "bg-transparent border-2 border-border-strong text-text-primary",
        !disabled && !hasError && "hover:border-accent-primary focus:border-accent-primary",
        !hasError && "focus:ring-accent-primary"
      ],
      ghost: [
        "bg-transparent border border-transparent text-text-primary",
        !disabled && !hasError && "hover:bg-state-hover focus:bg-state-hover focus:border-border-default",
        !hasError && "focus:ring-accent-primary"
      ]
    };

    // State classes
    const stateClasses = [];
    if (hasError) {
      stateClasses.push(
        "border-red-500 focus:border-red-500 focus:ring-red-500"
      );
      if (variant !== 'ghost') {
        stateClasses.push("bg-red-50 dark:bg-red-950/20");
      }
    } else if (success) {
      stateClasses.push(
        "border-green-500 focus:border-green-500 focus:ring-green-500"
      );
      if (variant !== 'ghost') {
        stateClasses.push("bg-green-50 dark:bg-green-950/20");
      }
    }

    const allClasses = [
      ...baseClasses,
      sizeClasses[inputSize],
      ...iconPaddingClasses,
      ...variantClasses[variant].filter(Boolean),
      ...stateClasses
    ].filter(Boolean);

    return (
      <div className={cn("flex flex-col gap-1.5", { "w-full": fullWidth })}>
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {icon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={type}
            id={inputId}
            className={cn(allClasses, className)}
            disabled={disabled}
            {...props}
          />

          {/* Right Icon */}
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {icon}
            </div>
          )}

          {/* State Icons */}
          {!icon && (hasError || success) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {hasError && (
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {success && !hasError && (
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          )}

          {/* Focus glow effect */}
          <div className="absolute inset-0 rounded-inherit opacity-0 pointer-events-none transition-opacity duration-180 focus-within:opacity-100 shadow-glow" />
        </div>

        {/* Helper/Error Text */}
        {(helperText || errorText) && (
          <p className={cn(
            "text-xs",
            {
              "text-text-muted": !hasError,
              "text-red-500": hasError,
            }
          )}>
            {errorText || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;