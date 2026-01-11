// src/features/bio-page/components/PublicBioPage.tsx
// Public bio page view component

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PublicBioView from "../../../components/PublicBioView";
import { bioPageService } from "../services/bioPageService";
import { linkService } from "../services/linkService";
import { blockService } from "../services/blockService";
import { customDomainService } from "../../custom-domain";
import { themeConfigToAppearance } from "../../../shared/types/theme";
import {
  useTrackPageView,
  useTrackLinkClick,
  useTrackBlockClick,
} from "../../analytics";
import type { BioPage, Link, Block } from "../../../shared/types";
import AuthorProfileModal from "./AuthorProfileModal";

export default function PublicBioPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [bioPage, setBioPage] = useState<BioPage | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);

  // Track page view
  useTrackPageView(bioPage?.id);

  // Get click tracking functions
  const trackLinkClick = useTrackLinkClick(bioPage?.id);
  const trackBlockClick = useTrackBlockClick(bioPage?.id);

  useEffect(() => {
    loadBioPage();
  }, [username]);

  const loadBioPage = async () => {
    try {
      setLoading(true);
      setNotFound(false);

      let bioPageId: string | null = null;
      const currentHost = window.location.hostname;

      console.log("[PublicBioPage] Loading bio page:", {
        currentHost,
        username,
        path: window.location.pathname,
      });

      // Priority 1: Username in URL → always use username route
      // (works with any domain: localhost, tunnel, production, custom)
      if (username) {
        console.log("[PublicBioPage] Username route:", username);
        const page = await bioPageService.getBioPageByUsername(username);
        if (!page) {
          console.error("[PublicBioPage] Username not found:", username);
          setNotFound(true);
          return;
        }
        console.log("[PublicBioPage] Found bioPage:", page.id);
        bioPageId = page.id;
      }
      // Priority 2: No username (root path) → check if custom domain exists in Firestore
      else {
        // Skip localhost/standard domains
        const isLocalhost =
          currentHost.includes("localhost") ||
          currentHost.includes("127.0.0.1") ||
          currentHost.includes("vielink.vn");

        if (isLocalhost) {
          console.log("[PublicBioPage] Localhost without username, redirect");
          navigate("/login");
          return;
        }

        // Try to find custom domain mapping (works for any domain user adds)
        console.log("[PublicBioPage] Checking custom domain:", currentHost);
        bioPageId = await customDomainService.getBioPageByDomain(currentHost);

        if (!bioPageId) {
          console.error(
            "[PublicBioPage] Custom domain not found:",
            currentHost
          );
          setNotFound(true);
          return;
        }
        console.log(
          "[PublicBioPage] Found bioPage via custom domain:",
          bioPageId
        );
      }

      // Load bio page by ID
      const page = await bioPageService.getBioPageById(bioPageId);

      if (!page) {
        setNotFound(true);
        return;
      }

      setBioPage(page);

      // Load links and blocks
      const [pageLinks, pageBlocks] = await Promise.all([
        linkService.getLinks(page.id),
        blockService.getBlocks(page.id),
      ]);

      // Filter only active links for public view
      const activeLinks = pageLinks.filter((link: Link) => link.isActive);
      setLinks(activeLinks);
      setBlocks(pageBlocks);
    } catch (error) {
      console.error("Error loading bio page:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8129d9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#676b5f]">Loading...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound || !bioPage) {
    return (
      <div className="min-h-screen bg-[#f6f7f5] flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-[#8129d9] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-4">Page Not Found</h1>
          <p className="text-[#676b5f] mb-6">
            The page @{username} doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-[#8129d9] text-white rounded-full hover:bg-[#7020c0] transition-colors"
          >
            Create Your Own
          </button>
        </div>
      </div>
    );
  }

  // Convert theme config to appearance format for PhonePreview
  const appearanceConfig = bioPage.themeConfig
    ? themeConfigToAppearance(bioPage.themeConfig)
    : null;

  // Map links to format expected by PhonePreview
  const mappedLinks = links.map((link) => ({
    id: link.id,
    title: link.title,
    url: link.url,
    isActive: link.isActive,
    type: link.type,
    platform: link.platform,
    data: link.data,
  }));

  // Map blocks to format expected by PublicBioView
  const mappedBlocks = blocks.map((block) => ({
    id: block.id,
    type: block.type,
    title: block.title,
    data: block.data,
    isActive: block.isVisible,
    isVisible: block.isVisible,
    order: block.sortOrder ?? 0,
  }));

  return (
    <>
      <PublicBioView
        username={bioPage.username}
        name={bioPage.displayName || bioPage.username}
        bio={bioPage.bioDescription || ""}
        profileImage={bioPage.avatarUrl || ""}
        links={mappedLinks}
        appearanceConfig={appearanceConfig}
        hideVielinkLogo={bioPage.isLogoHidden}
        blocks={mappedBlocks}
        onLinkClick={trackLinkClick}
        onBlockClick={trackBlockClick}
        onAuthorClick={() => setIsAuthorModalOpen(true)}
      />
      
      {/* Author Profile Modal */}
      <AuthorProfileModal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
        userId={bioPage.userId}
        currentUsername={bioPage.username}
      />
    </>
  );
}
