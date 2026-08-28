"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-[3px]",
    lg: "h-10 w-10 border-4",
  };

  return (
    <span
      className={`inline-block animate-spin rounded-full border-[#F78000]/20 border-t-[#F78000] ${sizes[size]} ${className}`}
      aria-label="Loading"
      role="status"
    />
  );
}