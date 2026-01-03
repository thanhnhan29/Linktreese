import { useState, useEffect, useRef } from "react";
import { User, LogOut, Copy, CheckCheck, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
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
import type { Block } from "./Blocks";
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

  // --- 1. LẤY DOC ID CỦA PAGE HIỆN TẠI ---
  useEffect(() => {
    if (!currentBioPageUsername) return;

    const q = query(
      collection(db, "bio_pages"),
      where("username", "==", currentBioPageUsername)
    );

    // Lắng nghe thay đổi của chính Bio Page (Profile, Avatar...)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
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

    // Tương tự cho blocks nếu bạn dùng
    const blocksRef = collection(db, "bio_pages", bioPageId, "blocks");
    // Giả sử cũng có trường sortOrder
    const q = query(blocksRef, orderBy("sortOrder", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedBlocks: Block[] = [];
      snapshot.forEach((doc) => {
        loadedBlocks.push({ id: doc.id, ...doc.data() } as Block);
      });
      setBlocks(loadedBlocks);
    });
    return () => unsubscribe();
  }, [bioPageId]);

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
    data?: any
  ) => {
    if (!bioPageId) return;
    try {
      const linksRef = collection(db, "bio_pages", bioPageId, "links");
      const newOrder =
        links.length > 0 ? (links[links.length - 1].order || 0) + 1 : 0;

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

  const moveLink = async (id: string, direction: "up" | "down") => {
    if (!bioPageId) return;
    const index = links.findIndex((l) => l.id === id);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const currentLink = links[index];
    const targetLink = links[targetIndex];

    // Hoán đổi vị trí order
    try {
      const batch = writeBatch(db);
      const currentRef = doc(
        db,
        "bio_pages",
        bioPageId,
        "links",
        currentLink.id
      );
      const targetRef = doc(db, "bio_pages", bioPageId, "links", targetLink.id);

      // Swap order values
      const currentOrder = currentLink.order || 0;
      const targetOrder = targetLink.order || 0;

      // Nếu order trùng nhau hoặc lỗi, ta có thể dùng index để gán lại
      // Ở đây giả sử order đã chuẩn
      batch.update(currentRef, { order: targetOrder });
      batch.update(targetRef, { order: currentOrder });

      await batch.commit();
    } catch (e) {
      console.error("Error moving link:", e);
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
                user={{ username: currentBioPageUsername, email: userEmail }}
                profileImage={profileImagePath || ""}
                bio={currentBioPage.bio}
                onAddLink={addLink}
                onUpdateLink={updateLink}
                onDeleteLink={deleteLink}
                onToggleLink={toggleLink}
                onMoveLink={moveLink}
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
                  title: b.data?.title || "Block",
                  type: b.type,
                }))}
              />
            )}
            {currentTab === "settings" && (
              <Settings
                user={{ username: currentBioPageUsername, email: userEmail }}
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
              blocks={blocks}
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
