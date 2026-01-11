// src/features/bio-page/components/BioPageCard.tsx
// Card component displaying a bio page summary in the author profile modal

import { Eye } from "lucide-react";

interface BioPageCardProps {
  username: string;
  displayName?: string;
  avatarUrl?: string;
  viewCount?: number;
  isCurrentPage?: boolean;
  onClick: () => void;
}

export default function BioPageCard({
  username,
  displayName,
  avatarUrl,
  viewCount = 0,
  isCurrentPage = false,
  onClick,
}: BioPageCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-3 rounded-xl flex items-center gap-3
        transition-all duration-200
        ${
          isCurrentPage
            ? "bg-[#8129d9]/10 border-2 border-[#8129d9] cursor-default"
            : "bg-white/50 border-2 border-transparent hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        }
      `}
      disabled={isCurrentPage}
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-[#e0e2d9] flex-shrink-0 overflow-hidden flex items-center justify-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName || username}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-lg font-semibold text-[#676b5f]">
            {(displayName || username)[0]?.toUpperCase() || "?"}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 text-left min-w-0">
        <p className="font-semibold text-black truncate">
          @{username}
        </p>
        {displayName && displayName !== username && (
          <p className="text-sm text-[#676b5f] truncate">
            {displayName}
          </p>
        )}
      </div>

      {/* View count */}
      <div className="flex items-center gap-1 text-sm text-[#676b5f]">
        <Eye className="w-4 h-4" />
        <span>{viewCount.toLocaleString()}</span>
      </div>

      {/* Current page badge */}
      {isCurrentPage && (
        <span className="px-2 py-1 text-xs font-medium text-[#8129d9] bg-[#8129d9]/10 rounded-full">
          Đang xem
        </span>
      )}
    </button>
  );
}
