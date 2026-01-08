import { useState, useEffect, useRef } from "react";
import { User, LogOut, Copy, CheckCheck, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import ProBadge from "./ProBadge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import LinkEditor from "./LinkEditor";
import PhonePreview from "./PhonePreview";
import Analytics from "./Analytics";
import Settings from "./Settings";
import Appearance from "./Appearance";
import type { Block } from "@/shared/types";
import { useFileImage } from "@/features/bio-page";
import { toast } from "sonner";

// --- FIRESTORE IMPORTS ---
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  orderBy,
  serverTimestamp,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

interface BioPage {
  id?: string; // Thêm ID để dễ thao tác update
  username: string;
  profileImage: string;
  bio: string; // Trong DB là bioDescription, cần map lại
  displayName: string;
}

interface Link {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  type?: "regular" | "social" | "ecommerce" | "donate" | "contact" | "chat";
  platform?: string;
  data?: any;
  order?: number; // Thêm trường để sắp xếp
}

interface DashboardProps {
  userEmail: string;
  userId?: string;
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
  const [bioPages, setBioPages] = useState<BioPage[]>([]);
  const [currentBioPage, setCurrentBioPage] = useState<BioPage | null>(null);
  const [bioPageId, setBioPageId] = useState<string | null>(null); // ID của document trên Firestore

  const [links, setLinks] = useState<Link[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]); // Blocks (nếu bạn dùng tính năng này)

  const [currentTab, setCurrentTab] = useState<
    "links" | "analytics" | "settings" | "appearance"
  >("links");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [appearanceConfig, setAppearanceConfig] = useState<any>(null);
  const [hideVielinkLogo, setHideVielinkLogo] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Get current URL base (localhost or production)
  const getShareUrl = () => {
    const baseUrl = window.location.origin; // Gets http://localhost:3000 or https://vielink.vn
    return `${baseUrl}/${currentBioPageUsername}`;
  };

  const menuRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // Get profile image from file storage
  const { imagePath: profileImagePath, uploadFromDataUrl: uploadProfileImage } =
    useFileImage({
      key: currentBioPageUsername,
      imageType: "profile",
    });

  // Get background image from file storage
  const { imagePath: bgImagePath, uploadFromDataUrl: uploadBgImage } =
    useFileImage({
      key: currentBioPageUsername,
      imageType: "background",
    });

  // --- 0. LẤY PRO STATUS TỪ USER (AUTO-CREATE IF MISSING) ---
  useEffect(() => {
    if (!userId) {
      console.log("[Dashboard] No userId provided to load PRO status");
      return;
    }

    console.log("[Dashboard] Listening user doc:", userId);
    const userDocRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setIsPro(data.proPurchase || false);
        console.log("[Dashboard] User PRO status:", data.proPurchase);
      } else {
        console.log("[Dashboard] User doc does not exist, creating default doc...");
        // Auto-create user doc with default values
        try {
          await setDoc(userDocRef, {
            email: userEmail,
            proPurchase: false,
            subscriptionPlan: "free",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          console.log("[Dashboard] User doc created successfully");
        } catch (error) {
          console.error("[Dashboard] Failed to create user doc:", error);
        }
      }
    }, (err) => {
      console.error('[Dashboard] Error listening user doc:', err);
    });

    return () => unsubscribe();
  }, [userId, userEmail]);

  // --- 1. LẤY DOC ID CỦA PAGE HIỆN TẠI ---
  useEffect(() => {
    if (!currentBioPageUsername) return;

    const q = query(
      collection(db, "bio_pages"),
      where("username", "==", currentBioPageUsername)
    );

    // Lắng nghe thay đổi của chính Bio Page (Profile, Avatar...)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(
        "[Dashboard] onSnapshot received:",
        snapshot.empty ? "empty" : snapshot.docs.length + " docs"
      );
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        console.log("[Dashboard] Setting bioPageId:", docSnap.id);
        setBioPageId(docSnap.id);

        const data = docSnap.data();
        // Map dữ liệu từ Firestore về state local
        setCurrentBioPage({
          id: docSnap.id,
          username: data.username,
          profileImage: data.avatarUrl || "", // Map avatarUrl -> profileImage
          bio: data.bioDescription || "", // Map bioDescription -> bio
          displayName: data.displayName || data.username,
        });

        // Load appearance config - prefer localStorage over Firestore
        // (because localStorage stores the actual image data)
        const savedAppearance = localStorage.getItem(
          `appearance_${currentBioPageUsername}`
        );
        if (savedAppearance) {
          try {
            setAppearanceConfig(JSON.parse(savedAppearance));
          } catch (e) {
            console.error("Error parsing saved appearance:", e);
            if (data.themeConfig) {
              setAppearanceConfig(data.themeConfig);
            }
          }
        } else if (data.themeConfig) {
          setAppearanceConfig(data.themeConfig);
        }

        // Load settings (ví dụ hideLogo)
        if (data.settings) {
          setHideVielinkLogo(data.settings.hideVielinkLogo || false);
        }
      }
    });

    return () => unsubscribe();
  }, [currentBioPageUsername]);

  // --- 2. LẤY LINKS (REAL-TIME) ---
  useEffect(() => {
    if (!bioPageId) return;

    // Query links từ subcollection 'links', sắp xếp theo 'order'
    const linksRef = collection(db, "bio_pages", bioPageId, "links");
    const q = query(linksRef, orderBy("order", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedLinks: Link[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        loadedLinks.push({
          id: doc.id,
          title: data.title,
          url: data.url,
          isActive: data.isActive,
          type: data.type,
          platform: data.platform,
          data: data.data,
          order: data.order,
        });
      });
      setLinks(loadedLinks);
    });

    return () => unsubscribe();
  }, [bioPageId]);

  // --- 3. LẤY BLOCKS (REAL-TIME) ---
  useEffect(() => {
    if (!bioPageId) return;

    const blocksRef = collection(db, "bio_pages", bioPageId, "blocks");
    const q = query(blocksRef, orderBy("sortOrder", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedBlocks: Block[] = [];
      let index = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        loadedBlocks.push({
          id: doc.id,
          type: data.type,
          title: data.title || "",
          isVisible: data.isVisible ?? true,
          sortOrder: data.sortOrder ?? index, // Use index as fallback for sortOrder
          clickCount: data.clickCount || 0,
          data: data.data || {},
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
        index++;
      });
      setBlocks(loadedBlocks);
    });
    return () => unsubscribe();
  }, [bioPageId]);

  // --- 3.5 NORMALIZE ORDERS ON LOAD ---
  const [ordersNormalized, setOrdersNormalized] = useState(false);
  useEffect(() => {
    if (
      !bioPageId ||
      ordersNormalized ||
      (links.length === 0 && blocks.length === 0)
    )
      return;

    // Check if normalization is needed
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

    const needsNormalization = allItems.some((item, idx) => item.order !== idx);
    if (!needsNormalization) {
      setOrdersNormalized(true);
      return;
    }

    // Normalize orders
    const normalizeAsync = async () => {
      console.log("[normalizeOrders] Normalizing orders on load...");
      try {
        const batch = writeBatch(db);
        allItems.forEach((item, newOrder) => {
          if (item.type === "link") {
            batch.update(doc(db, "bio_pages", bioPageId, "links", item.id), {
              order: newOrder,
            });
          } else {
            batch.update(doc(db, "bio_pages", bioPageId, "blocks", item.id), {
              sortOrder: newOrder,
            });
          }
        });
        await batch.commit();
        console.log("[normalizeOrders] Orders normalized successfully");
      } catch (e) {
        console.error("Error normalizing orders:", e);
      }
      setOrdersNormalized(true);
    };
    normalizeAsync();
  }, [bioPageId, links, blocks, ordersNormalized]);

  // --- 4. LẤY DANH SÁCH BIO PAGES (Cho Menu Switch) ---
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "bio_pages"),
      where("userId", "==", userId),
      orderBy("username", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pages: BioPage[] = snapshot.docs.map((d) => {
        const data: any = d.data();
        return {
          id: d.id,
          username: data.username,
          profileImage: data.avatarUrl || "",
          bio: data.bioDescription || "",
          displayName: data.displayName || data.username,
        };
      });
      setBioPages(pages);
    });

    return () => unsubscribe();
  }, [userId]);

  // --- CÁC HÀM XỬ LÝ (ACTIONS) ---

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const saveProfile = async (newProfileImage: string, newBio: string) => {
    console.log(
      `[Dashboard] saveProfile called - image length: ${
        newProfileImage?.length || 0
      }, bio: ${newBio?.substring(0, 50)}...`
    );

    // Save profile image to file storage (not Firestore)
    if (newProfileImage && newProfileImage.startsWith("data:")) {
      console.log(`[Dashboard] Uploading profile image...`);
      const result = await uploadProfileImage(newProfileImage);
      console.log(`[Dashboard] Upload result:`, result);

      if (result) {
        toast.success("Profile image saved!");
      } else {
        toast.error("Failed to save profile image. Please try again.");
        return; // Don't continue if image upload failed
      }
    } else {
      console.log(`[Dashboard] Skipping image upload - not a data URL`);
    }

    // Save bio to Firestore only
    if (!bioPageId) {
      console.log(`[Dashboard] No bioPageId, skipping Firestore update`);
      return;
    }

    try {
      const docRef = doc(db, "bio_pages", bioPageId);
      await updateDoc(docRef, {
        bioDescription: newBio,
      });
      console.log(`[Dashboard] Bio saved to Firestore`);
    } catch (e) {
      console.error("[Dashboard] Error saving profile:", e);
      toast.error("Failed to save bio. Please try again.");
    }
  };

  const updateDisplayName = async (newDisplayName: string) => {
    if (!bioPageId) return;
    try {
      const docRef = doc(db, "bio_pages", bioPageId);
      await updateDoc(docRef, { displayName: newDisplayName });
    } catch (e) {
      console.error("Error updating display name:", e);
    }
  };

  const addLink = async (
    title: string,
    url: string,
    type?: string,
    platform?: string,
    data?: any,
    order?: number
  ) => {
    if (!bioPageId) return;
    try {
      const linksRef = collection(db, "bio_pages", bioPageId, "links");

      // Use provided order or calculate max order from BOTH links and blocks
      let newOrder = order;
      if (newOrder === undefined) {
        const maxLinkOrder = links.reduce(
          (max, link) => Math.max(max, link.order ?? 0),
          -1
        );
        const maxBlockOrder = blocks.reduce(
          (max, block) => Math.max(max, block.sortOrder ?? 0),
          -1
        );
        newOrder = Math.max(maxLinkOrder, maxBlockOrder) + 1;
      }

      await addDoc(linksRef, {
        title,
        url,
        isActive: true,
        type: type || "classic",
        platform: platform || null,
        data: data || {},
        order: newOrder,
        createdAt: serverTimestamp(),
      });
      console.log("[addLink] Link added with unified order:", newOrder);
    } catch (e) {
      console.error("Error adding link:", e);
    }
  };

  const updateLink = async (
    id: string,
    title: string,
    url: string,
    type?: string,
    platform?: string,
    data?: any
  ) => {
    if (!bioPageId) return;
    try {
      const linkRef = doc(db, "bio_pages", bioPageId, "links", id);
      await updateDoc(linkRef, {
        title,
        url,
        type: type || "classic",
        platform: platform || null,
        data: data || {}, // Merge data
      });
    } catch (e) {
      console.error("Error updating link:", e);
    }
  };

  const deleteLink = async (id: string) => {
    if (!bioPageId) return;
    try {
      await deleteDoc(doc(db, "bio_pages", bioPageId, "links", id));
    } catch (e) {
      console.error("Error deleting link:", e);
    }
  };

  const toggleLink = async (id: string) => {
    if (!bioPageId) return;
    const link = links.find((l) => l.id === id);
    if (!link) return;

    try {
      await updateDoc(doc(db, "bio_pages", bioPageId, "links", id), {
        isActive: !link.isActive,
      });
    } catch (e) {
      console.error("Error toggling link:", e);
    }
  };

  // --- BLOCK CRUD OPERATIONS ---
  const addBlock = async (
    type: "ecommerce" | "donate" | "contact" | "chat",
    title: string,
    data: Record<string, unknown>,
    order?: number
  ) => {
    if (!bioPageId) return;
    try {
      // Use provided order or calculate max order from BOTH links and blocks
      let newOrder = order;
      if (newOrder === undefined) {
        const maxLinkOrder = links.reduce(
          (max, link) => Math.max(max, link.order ?? 0),
          -1
        );
        const maxBlockOrder = blocks.reduce(
          (max, block) => Math.max(max, block.sortOrder ?? 0),
          -1
        );
        newOrder = Math.max(maxLinkOrder, maxBlockOrder) + 1;
      }

      const blocksRef = collection(db, "bio_pages", bioPageId, "blocks");
      await addDoc(blocksRef, {
        type,
        title,
        data,
        isVisible: true,
        sortOrder: newOrder,
        clickCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("[addBlock] Block added with unified order:", newOrder);
    } catch (e) {
      console.error("Error adding block:", e);
      throw e;
    }
  };

  const updateBlock = async (
    id: string,
    title?: string,
    data?: Record<string, unknown>
  ) => {
    if (!bioPageId) return;
    try {
      // Find existing block to merge data
      const existingBlock = blocks.find((b) => b.id === id);

      const blockRef = doc(db, "bio_pages", bioPageId, "blocks", id);
      const updates: any = { updatedAt: serverTimestamp() };

      if (title !== undefined) updates.title = title;

      // Merge data instead of replacing completely
      if (data !== undefined) {
        updates.data = {
          ...(existingBlock?.data || {}), // Keep existing data
          ...data, // Override with new data
        };
      }

      await updateDoc(blockRef, updates);
    } catch (e) {
      console.error("Error updating block:", e);
      throw e;
    }
  };

  const deleteBlock = async (id: string) => {
    if (!bioPageId) return;
    try {
      await deleteDoc(doc(db, "bio_pages", bioPageId, "blocks", id));
    } catch (e) {
      console.error("Error deleting block:", e);
      throw e;
    }
  };

  const toggleBlock = async (id: string) => {
    if (!bioPageId) return;
    const block = blocks.find((b) => b.id === id);
    if (!block) {
      console.error("[toggleBlock] Block not found:", id);
      return;
    }

    console.log(
      "[toggleBlock] Toggling block:",
      id,
      "current visibility:",
      block.isVisible
    );
    try {
      await updateDoc(doc(db, "bio_pages", bioPageId, "blocks", id), {
        isVisible: !block.isVisible,
        updatedAt: serverTimestamp(),
      });
      console.log("[toggleBlock] Block toggled successfully");
    } catch (e) {
      console.error("Error toggling block:", e);
      throw e;
    }
  };

  // --- UNIFIED MOVE FUNCTION - Move item to any position ---
  const moveUnified = async (
    id: string,
    itemType: "link" | "block",
    directionOrTargetIndex: "up" | "down" | number
  ) => {
    if (!bioPageId) return;

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

    // Find current item by id and type
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
      toIndex = directionOrTargetIndex === "up" ? fromIndex - 1 : fromIndex + 1;
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
            batch.update(doc(db, "bio_pages", bioPageId, "links", item.id), {
              order: newOrderIndex,
            });
          } else {
            batch.update(doc(db, "bio_pages", bioPageId, "blocks", item.id), {
              sortOrder: newOrderIndex,
              updatedAt: serverTimestamp(),
            });
          }
        }
      });

      await batch.commit();
      console.log("[moveUnified] Move successful - item now at index", toIndex);
    } catch (e) {
      console.error("Error in moveUnified:", e);
      throw e;
    }
  };

  // --- HANDLER CHO APPEARANCE & SETTINGS ---
  const handleAppearanceChange = async (config: any) => {
    console.log(`[Dashboard] handleAppearanceChange called`);

    if (!bioPageId) {
      console.log(`[Dashboard] No bioPageId, skipping appearance update`);
      return;
    }

    // Save background image to file storage if it's a data URL
    if (
      config.background?.imageUrl &&
      config.background.imageUrl.startsWith("data:")
    ) {
      console.log(`[Dashboard] Uploading background image...`);
      const result = await uploadBgImage(config.background.imageUrl);
      console.log(`[Dashboard] Background upload result:`, result);

      if (result) {
        toast.success("Background image saved!");
      } else {
        toast.error("Failed to save background image.");
      }
    }

    // Save config to Firestore WITHOUT the base64 image (to avoid size limits)
    const configForFirestore = {
      ...config,
      background: {
        ...config.background,
        // Store 'file' marker instead of actual base64 data
        imageUrl:
          config.background?.type === "image" && config.background.imageUrl
            ? "file"
            : "",
      },
    };

    try {
      // Save to Firestore (without large base64 data)
      await updateDoc(doc(db, "bio_pages", bioPageId), {
        themeConfig: configForFirestore,
      });
      console.log(`[Dashboard] Appearance config saved to Firestore`);
    } catch (e) {
      console.error("[Dashboard] Error saving appearance:", e);
      toast.error("Failed to save appearance settings.");
    }
  };

  const handleSettingsChange = async (settings: any) => {
    if (!bioPageId) return;
    try {
      await updateDoc(doc(db, "bio_pages", bioPageId), {
        settings: settings, // Lưu object settings
      });
      setHideVielinkLogo(settings.hideVielinkLogo);
    } catch (e) {
      console.error("Error saving settings:", e);
    }
  };

  // --- RENDER ---
  // (Phần Render giữ nguyên cấu trúc cũ, chỉ thay đổi các hàm handler truyền vào)

  if (!currentBioPage) {
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
              {["links", "appearance", "analytics", "settings"].map((tab) => (
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

            {/* Account Menu (Giữ nguyên logic đóng mở menu) */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="w-10 h-10 bg-[#e0e2d9] rounded-full flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-[#8129d9] transition-all"
              >
                {profileImagePath ? (
                  <img
                    src={profileImagePath}
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
                            {page.profileImage ? (
                              <img
                                src={page.profileImage}
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
            {currentTab === "links" && (
              <LinkEditor
                links={links}
                blocks={blocks}
                user={{ username: currentBioPageUsername, email: userEmail }}
                profileImage={profileImagePath || ""}
                bio={currentBioPage.bio}
                onAddLink={addLink}
                onUpdateLink={updateLink}
                onDeleteLink={deleteLink}
                onToggleLink={toggleLink}
                onAddBlock={addBlock}
                onUpdateBlock={updateBlock}
                onDeleteBlock={deleteBlock}
                onToggleBlock={toggleBlock}
                onMoveUnified={moveUnified}
                onUpdateProfile={saveProfile}
              />
            )}
            {currentTab === "appearance" && (
              <Appearance
                username={currentBioPageUsername}
                onConfigChange={handleAppearanceChange} // Dùng hàm mới lưu Firestore
              />
            )}
            {currentTab === "analytics" && bioPageId && (
              <Analytics
                pageId={bioPageId}
                username={currentBioPageUsername}
                links={links}
                blocks={blocks.map((b) => ({
                  id: b.id,
                  title: b.title || (b.data?.title as string) || "Block",
                  type: b.type,
                }))}
              />
            )}
            {currentTab === "settings" && (
              <Settings
                user={{ username: currentBioPageUsername, email: userEmail }}
                userId={userId}
                bioPageId={bioPageId || undefined}
                onLogout={onLogout}
                onUpdateDisplayName={updateDisplayName}
                onSettingsChange={handleSettingsChange} // Dùng hàm mới lưu Firestore
              />
            )}
          </div>

          {/* Right Side - Preview */}
          <div className="sticky top-8 h-fit">
            <PhonePreview
              username={currentBioPageUsername}
              name={currentBioPage.displayName}
              bio={currentBioPage.bio}
              profileImage={profileImagePath || ""}
              links={links.filter((link) => link.isActive)}
              blocks={blocks.filter((block) => block.isVisible)}
              appearanceConfig={
                appearanceConfig
                  ? {
                      ...appearanceConfig,
                      background: {
                        ...appearanceConfig.background,
                        // Use file-based background image if available
                        imageUrl:
                          bgImagePath ||
                          appearanceConfig.background?.imageUrl ||
                          "",
                      },
                    }
                  : null
              }
              hideVielinkLogo={hideVielinkLogo}
            />
          </div>
        </div>
      </div>

      {/* Share Dialog (Giữ nguyên) */}
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
                value={getShareUrl()}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="w-full flex items-center gap-2 bg-[#f6f7f5] border border-[#e0e2d9] rounded-full px-4 py-3">
              <input
                type="text"
                readOnly
                value={getShareUrl()}
                className="flex-1 bg-transparent text-black text-sm outline-none"
              />
              <button
                onClick={() => copyToClipboard(getShareUrl())}
                className="flex items-center gap-2 bg-[#8129d9] text-white px-4 py-2 rounded-full"
              >
                {copiedLink ? <CheckCheck size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <button
              onClick={() => {
                /*Logic download giữ nguyên*/
              }}
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
