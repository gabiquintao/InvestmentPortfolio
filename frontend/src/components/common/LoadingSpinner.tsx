// ============================================================================
// LoadingSpinner Component
// Reusable loading spinner with multiple sizes and variants
// ============================================================================

import type { HTMLAttributes } from "react";

// ============================================================================
// TYPES
// ============================================================================

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerVariant = "primary" | "secondary" | "white";

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  fullScreen?: boolean;
  text?: string;
}

// ============================================================================
// STYLE MAPPINGS
// ============================================================================

const sizeStyles: Record<SpinnerSize, string> = {
  xs: "h-4 w-4 border-2",
  sm: "h-6 w-6 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
  xl: "h-16 w-16 border-4",
};

const variantStyles: Record<SpinnerVariant, string> = {
  primary: "border-blue-600",
  secondary: "border-gray-600",
  white: "border-white",
};

// ============================================================================
// LOADING SPINNER COMPONENT
// ============================================================================

export const LoadingSpinner = ({
  size = "md",
  variant = "primary",
  fullScreen = false,
  text,
  className = "",
  ...props
}: LoadingSpinnerProps) => {
  const spinnerClasses = [
    "inline-block animate-spin rounded-full border-solid border-t-transparent",
    sizeStyles[size],
    variantStyles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3" {...props}>
      <div className={spinnerClasses} role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className="text-sm text-gray-600 font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// ============================================================================
// INLINE SPINNER (for buttons, small spaces)
// ============================================================================

interface InlineSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
}

export const InlineSpinner = ({
  size = "sm",
  variant = "primary",
}: InlineSpinnerProps) => {
  const spinnerClasses = [
    "inline-block animate-spin rounded-full border-solid border-t-transparent",
    sizeStyles[size],
    variantStyles[variant],
  ].join(" ");

  return (
    <div className={spinnerClasses} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// ============================================================================
// PAGE LOADER (centered with overlay)
// ============================================================================

interface PageLoaderProps {
  text?: string;
  overlay?: boolean;
}

export const PageLoader = ({
  text = "Loading...",
  overlay = false,
}: PageLoaderProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent" />
      <p className="text-base text-gray-700 font-medium">{text}</p>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white rounded-lg shadow-xl p-8">{content}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-100">{content}</div>
  );
};

// ============================================================================
// TABLE LOADER (skeleton for tables)
// ============================================================================

interface TableLoaderProps {
  rows?: number;
  columns?: number;
}

export const TableLoader = ({ rows = 5, columns = 4 }: TableLoaderProps) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-8 bg-gray-200 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// CARD LOADER (skeleton for cards)
// ============================================================================

export const CardLoader = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
