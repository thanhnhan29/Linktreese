import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "Chưa có link nào",
  description = "Hãy tạo link đầu tiên của bạn để bắt đầu chia sẻ",
  actionLabel = "Tạo link ngay",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      {/* SVG Illustration */}
      <div className="mb-6">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-40"
        >
          {/* Background circles */}
          <circle cx="100" cy="100" r="80" fill="#e0f7ff" opacity="0.3" />
          <circle cx="100" cy="100" r="60" fill="#cceeff" opacity="0.4" />

          {/* Link chain icon */}
          <g transform="translate(60, 60)">
            <path
              d="M40 30 L50 30 C58 30 58 42 50 42 L40 42"
              stroke="#8129d9"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M40 58 L50 58 C58 58 58 70 50 70 L40 70"
              stroke="#8129d9"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <line
              x1="45"
              y1="36"
              x2="45"
              y2="64"
              stroke="#d946ef"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>

          {/* Decorative dots */}
          <circle cx="40" cy="40" r="4" fill="#8129d9" opacity="0.3" />
          <circle cx="160" cy="50" r="5" fill="#d946ef" opacity="0.3" />
          <circle cx="50" cy="160" r="3" fill="#8129d9" opacity="0.3" />
          <circle cx="150" cy="150" r="4" fill="#cceeff" opacity="0.5" />
        </svg>
      </div>

      {/* Text Content */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">{description}</p>

      {/* Action Button */}
      {onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-[#8129d9] to-[#d946ef] hover:from-[#6f23b8] hover:to-[#c133d9] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
