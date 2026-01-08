// src/features/bio-page/components/Dashboard.tsx
// Main dashboard component using the new architecture

import { useState, useEffect, useRef, useCallback } from "react";
import { User, LogOut, Copy, CheckCheck, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  writeBatch,
  doc,
  serverTimestamp,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "@/infrastructure/firebase";
import ProBadge from "@/components/ProBadge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LinkEditor from "@/components/LinkEditor";
import PhonePreview from "@/components/PhonePreview";
import Analytics from "@/components/Analytics";
import Settings from "@/components/Settings";
import Appearance from "@/components/Appearance";
import { useBioPage, useLinks, useBlocks } from "../hooks";
import {
  themeConfigToAppearance,
  appearanceToThemeConfig,
  type AppearanceConfig,
} from "@/shared/types/theme";

interface DashboardProps {
  userEmail: string;
  userId: string;
  currentBioPageUsername: string;
  onSwitchBioPage: (username: string) => void;
  onCreateNewBioPage: () => void;
  onLogout: () => void;
}

export default function Dashboard({
  userEmail,
  userId,
  currentBioPageUsername,
  onSwitchBioPage,
  onCreateNewBioPage,
  onLogout,
}: DashboardProps) {
  const [currentTab, setCurrentTab] = useState<
    "Links" | "Analytics" | "Settings" | "Appearance"
  >("Links");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // Listen to user doc for PRO status
  useEffect(() => {
    if (!userId) {
      console.log("[Dashboard] No userId provided");
      return;
    }

    console.log("[Dashboard] Listening user doc:", userId);
    const userDocRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(
      userDocRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setIsPro(data.proPurchase || false);
          console.log("[Dashboard] User PRO status:", data.proPurchase);
        } else {
          console.log("[Dashboard] User doc missing, creating...");
          try {
            await setDoc(userDocRef, {
              email: userEmail,
              proPurchase: false,
              subscriptionPlan: "free",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            console.log("[Dashboard] User doc created");
          } catch (error) {
            console.error("[Dashboard] Failed to create user doc:", error);
          }
        }
      },
      (err) => {
        console.error("[Dashboard] Error listening user doc:", err);
      }
    );

    return () => unsubscribe();
  }, [userId, userEmail]);

  // Use the new hooks
  const {
    bioPage,
    bioPages,
    loading: bioPageLoading,
    updateProfile,
    updateDisplayName,
    updateTheme,
    updateSettings,
  } = useBioPage(userId, currentBioPageUsername);

  const {
    links,
    addLink: addLinkBase,
    updateLink,
    deleteLink,
    toggleLink,
  } = useLinks(bioPage?.id || null);

  const {
    blocks,
    addBlock: addBlockBase,
    updateBlock,
    deleteBlock,
    toggleBlock,
  } = useBlocks(bioPage?.id || null);

  // Wrapper for addLink to use unified order
  const addLink = useCallback(
    async (
      title: string,
      url: string,
      type?: string,
      platform?: string,
      data?: Record<string, unknown>
    ) => {
      // Calculate max order from BOTH links and blocks
      const maxLinkOrder = links.reduce(
        (max, link) => Math.max(max, link.order ?? 0),
        -1
      );
      const maxBlockOrder = blocks.reduce(
        (max, block) => Math.max(max, block.sortOrder ?? 0),
        -1
      );
      const newOrder = Math.max(maxLinkOrder, maxBlockOrder) + 1;

      // Pass order via data since we can't modify service directly
      await addLinkBase(title, url, type, platform, {
        ...data,
        _unifiedOrder: newOrder,
      });
    },
    [addLinkBase, links, blocks]
  );

  // Wrapper for addBlock to use unified order
  const addBlock = useCallback(
    async (
      type: "ecommerce" | "donate" | "contact" | "chat",
      title: string,
      data: Record<string, unknown>
    ) => {
      // Calculate max order from BOTH links and blocks
      const maxLinkOrder = links.reduce(
        (max, link) => Math.max(max, link.order ?? 0),
        -1
      );
      const maxBlockOrder = blocks.reduce(
        (max, block) => Math.max(max, block.sortOrder ?? 0),
        -1
      );
      const newOrder = Math.max(maxLinkOrder, maxBlockOrder) + 1;

      // Pass order via data since we can't modify service directly
      await addBlockBase(type, title, { ...data, _unifiedOrder: newOrder });
    },
    [addBlockBase, links, blocks]
  );

  // Unified move function for cross-type ordering - supports direction or target index
  const moveUnified = useCallback(
    async (
      id: string,
      itemType: "link" | "block",
      directionOrTargetIndex: "up" | "down" | number
    ) => {
      if (!bioPage?.id) return;

      // Create unified items list with same order space
      type UnifiedItem = { id: string; type: "link" | "block"; order: number };
      const allItems: UnifiedItem[] = [
        ...links.map((link, idx) => ({
          id: link.id,
          type: "link" as const,
          order: link.order ?? idx,
        })),
        ...blocks.map((block, idx) => ({
          id: block.id,
          type: "block" as const,
          order: block.sortOrder ?? links.length + idx,
        })),
      ].sort((a, b) => a.order - b.order);

      // Find current item
      const fromIndex = allItems.findIndex(
        (item) => item.id === id && item.type === itemType
      );
      if (fromIndex === -1) {
        console.error("[moveUnified] Item not found:", id, itemType);
        return;
      }

      // Calculate target index
      let toIndex: number;
      if (typeof directionOrTargetIndex === "number") {
        toIndex = directionOrTargetIndex;
      } else {
        toIndex =
          directionOrTargetIndex === "up" ? fromIndex - 1 : fromIndex + 1;
      }

      // Validate bounds
      if (toIndex < 0 || toIndex >= allItems.length || fromIndex === toIndex) {
        console.log("[moveUnified] Cannot move - invalid target index");
        return;
      }

      console.log(
        "[moveUnified] Moving item from index",
        fromIndex,
        "to index",
        toIndex
      );

      try {
        const batch = writeBatch(db);

        // Create new order array by removing item from old position and inserting at new
        const newOrder = [...allItems];
        const [movedItem] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, movedItem);

        // Update all affected items with their new sequential order
        newOrder.forEach((item, newOrderIndex) => {
          const oldOrder = item.order;
          if (oldOrder !== newOrderIndex) {
            if (item.type === "link") {
              batch.update(doc(db, "bio_pages", bioPage.id, "links", item.id), {
                order: newOrderIndex,
              });
            } else {
              batch.update(
                doc(db, "bio_pages", bioPage.id, "blocks", item.id),
                {
                  sortOrder: newOrderIndex,
                  updatedAt: serverTimestamp(),
                }
              );
            }
          }
        });

        await batch.commit();
        console.log(
          "[moveUnified] Move successful - item now at index",
          toIndex
        );
      } catch (e) {
        console.error("Error in moveUnified:", e);
        throw e;
      }
    },
    [bioPage?.id, links, blocks]
  );

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleSaveProfile = async (newProfileImage: string, newBio: string) => {
    await updateProfile(newProfileImage, newBio);
  };

  const handleSettingsChange = async (settings: any) => {
    await updateSettings(settings);
  };

  const downloadQR = () => {
    const svg = qrCodeRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `vielink-${currentBioPageUsername}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // Map links to format expected by existing components
  const mappedLinks = links.map((link) => ({
    id: link.id,
    title: link.title,
    url: link.url,
    isActive: link.isActive,
    type: link.type,
    platform: link.platform,
    data: link.data,
    order: link.order,
  }));

  if (bioPageLoading || !bioPage) {
    return (
      <div className="min-h-screen bg-[#f6f7f5] flex items-center justify-center">
        <p className="text-[#676b5f]">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f5]">
      {/* Header */}
      <header className="bg-white border-b border-[#e0e2d9]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h2 className="text-black font-bold">Vielink</h2>

            <nav className="flex gap-6">
              {["Links", "Appearance", "Analytics", "Settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab as any)}
                  className={`capitalize ${
                    currentTab === tab
                      ? "text-black font-medium"
                      : "text-[#676b5f] hover:text-[#8129d9]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#676b5f] text-sm">
                @{currentBioPageUsername}
              </span>
              <ProBadge isPro={isPro} size="sm" />
            </div>
            <button
              className="bg-white border border-[#e0e2d9] text-black px-4 py-2 rounded-full hover:bg-[#f6f7f5]"
              onClick={() => setShowShareDialog(true)}
            >
              Share
            </button>

            {/* Account Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="w-10 h-10 bg-[#e0e2d9] rounded-full flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-[#8129d9] transition-all"
              >
                {bioPage.avatarUrl ? (
                  <img
                    src={bioPage.avatarUrl}
                    alt={currentBioPageUsername}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-[#676b5f]" />
                )}
              </button>

              {showAccountMenu && (
                <div className="absolute top-full right-0 mt-2 w-[300px] bg-white border border-[#e0e2d9] rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-[#e0e2d9]">
                    <p className="text-black truncate">{userEmail}</p>
                    <button
                      onClick={onLogout}
                      className="text-red-500 text-sm mt-2 flex items-center gap-2"
                    >
                      <LogOut size={14} /> Log out
                    </button>
                  </div>

                  {/* List of bio pages for quick switching */}
                  <div className="max-h-56 overflow-y-auto">
                    {bioPages.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-[#676b5f]">
                        No bio pages yet
                      </div>
                    ) : (
                      bioPages.map((page) => (
                        <button
                          key={page.id}
                          onClick={() => {
                            onSwitchBioPage(page.username);
                            setShowAccountMenu(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-[#f6f7f5] flex items-center gap-3 ${
                            page.username === currentBioPageUsername
                              ? "bg-[#f3f4f2]"
                              : ""
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#e0e2d9] flex items-center justify-center">
                            {page.avatarUrl ? (
                              <img
                                src={page.avatarUrl}
                                alt={page.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm text-[#676b5f]">
                                {page.displayName?.[0]?.toUpperCase() ||
                                  page.username?.[0]?.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-black truncate">
                              {page.displayName}
                            </p>
                            <p className="text-sm text-[#676b5f]">
                              @{page.username}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-2 border-t">
                    <button
                      onClick={() => {
                        onCreateNewBioPage();
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left text-sm text-[#8129d9]"
                    >
                      + Create new bio page
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-[1fr_400px] gap-8">
          {/* Left Side */}
          <div>
            {currentTab === "Links" && (
              <LinkEditor
                links={mappedLinks as any}
                blocks={blocks}
                user={{ username: currentBioPageUsername, email: userEmail }}
                profileImage={bioPage.avatarUrl || ""}
                bio={bioPage.bioDescription || ""}
                onAddLink={addLink}
                onUpdateLink={updateLink}
                onDeleteLink={deleteLink}
                onToggleLink={toggleLink}
                onAddBlock={addBlock}
                onUpdateBlock={updateBlock}
                onDeleteBlock={deleteBlock}
                onToggleBlock={toggleBlock}
                onMoveUnified={moveUnified}
                onUpdateProfile={handleSaveProfile}
              />
            )}
            {currentTab === "Appearance" && (
              <Appearance
                username={currentBioPageUsername}
                onConfigChange={(config: AppearanceConfig) => {
                  // Convert AppearanceConfig to ThemeConfig for storage
                  const themeConfig = appearanceToThemeConfig(config);
                  updateTheme(themeConfig);
                }}
              />
            )}
            {currentTab === "Analytics" && bioPage && (
              <Analytics
                pageId={bioPage.id}
                username={currentBioPageUsername}
                links={mappedLinks}
                blocks={blocks.map((b) => ({
                  id: b.id,
                  title: b.title,
                  type: b.type,
                }))}
              />
            )}
            {currentTab === "Settings" && (
              <Settings
                user={{ username: currentBioPageUsername, email: userEmail }}
                userId={userId}
                bioPageId={bioPage?.id}
                onLogout={onLogout}
                onUpdateDisplayName={updateDisplayName}
                onSettingsChange={handleSettingsChange}
              />
            )}
          </div>

          {/* Right Side - Preview */}
          <div className="sticky top-8 h-fit">
            <PhonePreview
              username={currentBioPageUsername}
              name={bioPage.displayName || currentBioPageUsername}
              bio={bioPage.bioDescription || ""}
              profileImage={bioPage.avatarUrl || ""}
              links={mappedLinks.filter((link) => link.isActive) as any}
              blocks={blocks.filter((block) => block.isVisible) as any}
              appearanceConfig={
                bioPage.themeConfig
                  ? themeConfigToAppearance(bioPage.themeConfig)
                  : undefined
              }
              hideVielinkLogo={bioPage.settings?.hideVielinkLogo || false}
            />
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog
        open={showShareDialog}
        onOpenChange={(open: boolean) => {
          setShowShareDialog(open);
          if (!open) setCopiedLink(false);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle className="text-center text-2xl">
            Share your Linktree
          </DialogTitle>
          <DialogDescription className="text-center">
            Scan QR code
          </DialogDescription>
          <div className="flex flex-col items-center gap-6 py-4">
            <div
              className="bg-white p-6 rounded-2xl border-2 border-[#e0e2d9] shadow-sm"
              ref={qrCodeRef}
            >
              <QRCodeSVG
                value={`https://vielink.vn/${currentBioPageUsername}`}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="w-full flex items-center gap-2 bg-[#f6f7f5] border border-[#e0e2d9] rounded-full px-4 py-3">
              <input
                type="text"
                readOnly
                value={`https://vielink.vn/${currentBioPageUsername}`}
                className="flex-1 bg-transparent text-black text-sm outline-none"
              />
              <button
                onClick={() =>
                  copyToClipboard(
                    `https://vielink.vn/${currentBioPageUsername}`
                  )
                }
                className="flex items-center gap-2 bg-[#8129d9] text-white px-4 py-2 rounded-full"
              >
                {copiedLink ? <CheckCheck size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <button
              onClick={downloadQR}
              className="flex items-center gap-2 bg-[#8129d9] text-white px-4 py-2 rounded-full"
            >
              <Download size={16} /> Download QR
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
