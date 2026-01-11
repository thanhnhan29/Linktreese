// src/features/bio-page/components/AuthorProfileModal.tsx
// Modal component displaying author overview and their other bio pages

import { useState, useEffect } from "react";
import { X, Users, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authorService, type AuthorOverview } from "../services/authorService";
import BioPageCard from "./BioPageCard";

interface AuthorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentUsername: string;
}

export default function AuthorProfileModal({
  isOpen,
  onClose,
  userId,
  currentUsername,
}: AuthorProfileModalProps) {
  const navigate = useNavigate();
  const [authorData, setAuthorData] = useState<AuthorOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      loadAuthorData();
    }
  }, [isOpen, userId]);

  const loadAuthorData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authorService.getAuthorOverview(userId);
      if (data) {
        setAuthorData(data);
      } else {
        setError("Không thể tải thông tin tác giả");
      }
    } catch (err) {
      console.error("Error loading author data:", err);
      setError("Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = (username: string) => {
    if (username !== currentUsername) {
      onClose();
      navigate(`/${username}`);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Find the current page to use its avatar/name in header
  const currentPage = authorData?.bioPages.find(
    (p) => p.username === currentUsername
  ) || authorData?.bioPages[0];
  
  const headerAvatar = currentPage?.avatarUrl;
  const headerName = currentPage?.displayName || currentPage?.username || "Tác giả";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{ maxHeight: "85vh" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
        >
          <X className="w-5 h-5 text-[#676b5f]" />
        </button>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: "85vh" }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-[#8129d9] animate-spin mb-4" />
              <p className="text-[#676b5f]">Đang tải...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-[#676b5f] text-center">{error}</p>
              <button
                onClick={loadAuthorData}
                className="mt-4 px-4 py-2 text-sm text-[#8129d9] hover:bg-[#8129d9]/5 rounded-lg transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : authorData ? (
            <>
              {/* Header - use current page's avatar/name */}
              <div className="pt-8 pb-6 px-6 text-center bg-gradient-to-b from-[#8129d9]/5 to-transparent">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-[#e0e2d9] mx-auto mb-4 overflow-hidden flex items-center justify-center ring-4 ring-white shadow-lg">
                  {headerAvatar ? (
                    <img
                      src={headerAvatar}
                      alt={headerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-[#676b5f]">
                      {headerName[0]?.toUpperCase() || "?"}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h2 className="text-xl font-bold text-black mb-2">
                  {headerName}
                </h2>

                {/* Stats */}
                <div className="flex items-center justify-center gap-4 text-sm text-[#676b5f]">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{authorData.bioPages.length} trang bio</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{authorData.totalViews.toLocaleString()} lượt xem</span>
                  </div>
                </div>
              </div>

              {/* Bio Pages List */}
              <div className="px-6 pb-6">
                <h3 className="text-sm font-semibold text-[#676b5f] uppercase tracking-wide mb-3">
                  Các trang bio
                </h3>
                <div className="space-y-2">
                  {authorData.bioPages.map((page) => (
                    <BioPageCard
                      key={page.id}
                      username={page.username}
                      displayName={page.displayName}
                      avatarUrl={page.avatarUrl}
                      viewCount={page.viewCount}
                      isCurrentPage={page.username === currentUsername}
                      onClick={() => handlePageClick(page.username)}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
