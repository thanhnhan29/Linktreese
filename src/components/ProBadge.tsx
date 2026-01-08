// src/components/ProBadge.tsx
// PRO tier badge component

import { Crown } from "lucide-react";

interface ProBadgeProps {
  isPro: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function ProBadge({
  isPro,
  size = "md",
  showLabel = true,
}: ProBadgeProps) {
  if (!isPro) {
    return showLabel ? (
      <span className="text-xs text-[#676b5f] bg-[#f6f7f5] px-2 py-1 rounded-full">
        Free
      </span>
    ) : null;
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-[#8129d9] to-[#d946ef] text-white font-medium rounded-full ${sizeClasses[size]}`}
    >
      <Crown size={iconSizes[size]} className="fill-current" />
      {showLabel && "PRO"}
    </span>
  );
}
