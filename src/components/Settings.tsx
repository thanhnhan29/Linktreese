import { useState, useEffect } from "react";
import { deleteUser } from "firebase/auth";
import { auth } from "@/infrastructure/firebase";
import { authService } from "@/features/auth/services/authService";
import { db } from "@/firebase";
import { collection, query, where, getDocs, doc, onSnapshot } from "firebase/firestore";
import {
  Globe,
  Lock,
  Bell,
  Trash2,
  CheckCircle,
  Copy,
  Crown,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { toast } from "sonner";
import Pricing from "./Pricing";
import { useCustomDomain } from "@/features/custom-domain";

interface User {
  username: string;
  email: string;
}

interface SettingsProps {
  user: User;
  userId?: string;
  bioPageId?: string;
  onLogout: () => void;
  onUpdateDisplayName: (displayName: string) => void;
  onSettingsChange?: (settings: any) => void;
}

export default function Settings({
  user,
  userId,
  bioPageId,
  onLogout,
  onUpdateDisplayName,
  onSettingsChange,
}: SettingsProps) {
  const [customDomain, setCustomDomain] = useState("");
  const [selectedBioPageId, setSelectedBioPageId] = useState<string>("");
  const [internalBioPageId, setInternalBioPageId] = useState<string | null>(
    null
  );
  const [internalUserId, setInternalUserId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDomainDialog, setShowDomainDialog] = useState(false);
  const [showDeleteDomainDialog, setShowDeleteDomainDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null);

  // Custom Domain hook - get domains for THIS bio page only
  const {
    domains: userDomains,
    createDomain,
    verifyDomain,
    deleteDomain,
  } = useCustomDomain({
    userId: userId || internalUserId || undefined,
    bioPageId: bioPageId || internalBioPageId || undefined,
    enabled: !!(bioPageId || internalBioPageId),
  });

  // Account settings
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  // Dialogs
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showPricingDialog, setShowPricingDialog] = useState(false);

  // Debounce timer for display name
  const [displayNameTimer, setDisplayNameTimer] =
    useState<NodeJS.Timeout | null>(null);

  // Privacy settings
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(true);

  // PRO settings
  const [hideVielinkLogo, setHideVielinkLogo] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  // Listen to user doc for PRO status
  useEffect(() => {
    const effectiveUserId = userId || internalUserId;
    if (!effectiveUserId) return;

    const userDocRef = doc(db, "users", effectiveUserId);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setIsPro(data.proPurchase || false);
      }
    });

    return () => unsubscribe();
  }, [userId, internalUserId]);

  useEffect(() => {
    // Always sync selectedBioPageId with bioPageId from props
    console.log("[Settings] bioPageId from props:", bioPageId);
    if (bioPageId) {
      setSelectedBioPageId(bioPageId);
      setInternalBioPageId(bioPageId);
    }
  }, [bioPageId]);

  // If bioPageId prop is not available, query it from username
  useEffect(() => {
    const fetchBioPageId = async () => {
      if (bioPageId || internalBioPageId) return; // Already have it
      if (!user.username) return;

      console.log("[Settings] Querying bioPageId for username:", user.username);
      try {
        const q = query(
          collection(db, "bio_pages"),
          where("username", "==", user.username)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docData = snapshot.docs[0];
          const docId = docData.id;
          const data = docData.data();
          console.log(
            "[Settings] Found bioPageId:",
            docId,
            "userId:",
            data.userId
          );
          setInternalBioPageId(docId);
          setSelectedBioPageId(docId);
          // Also get userId from the document
          if (data.userId && !userId && !internalUserId) {
            setInternalUserId(data.userId);
          }
        } else {
          console.error(
            "[Settings] No bio page found for username:",
            user.username
          );
        }
      } catch (error) {
        console.error("[Settings] Error fetching bioPageId:", error);
      }
    };

    fetchBioPageId();
  }, [user.username, bioPageId, internalBioPageId, userId, internalUserId]);

  useEffect(() => {
    // Load user settings
    const savedSettings = localStorage.getItem(`settings_${user.username}`);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setEmail(settings.email || user.email || "");
      setDisplayName(settings.displayName || user.username || "");
      setIsProfilePublic(settings.isProfilePublic ?? true);
      setShowAnalytics(settings.showAnalytics ?? true);
      setHideVielinkLogo(settings.hideVielinkLogo ?? false);
      setEmailNotifications(settings.emailNotifications ?? true);
      setWeeklyReports(settings.weeklyReports ?? false);
    } else {
      setEmail(user.email || "");
      setDisplayName(user.username || "");
    }
  }, [user.username, user.email]);

  const handleVerifyDomain = async () => {
    if (!customDomain) {
      toast.error("Vui lòng nhập domain");
      return;
    }

    // Sanitize domain: remove protocol and trailing slash
    const sanitizedDomain = customDomain
      .replace(/^https?:\/\//, "") // Remove http:// or https://
      .replace(/\/$/, "") // Remove trailing slash
      .toLowerCase()
      .trim();

    console.log("[Settings] Sanitized domain:", {
      original: customDomain,
      sanitized: sanitizedDomain,
    });

    // Use bioPageId from props, then internalBioPageId, then selectedBioPageId
    const targetBioPageId =
      bioPageId || internalBioPageId || selectedBioPageId || null;

    console.log("[Settings] Verify domain:", {
      customDomain: sanitizedDomain,
      selectedBioPageId,
      bioPageId,
      internalBioPageId,
      targetBioPageId,
    });

    if (!targetBioPageId) {
      toast.error("Không tìm thấy Bio Page. Vui lòng reload trang và thử lại.");
      return;
    }

    setIsVerifying(true);

    try {
      // Step 1: Create domain with sanitized domain name
      const createResult = await createDomain(sanitizedDomain, targetBioPageId);

      if (!createResult.success) {
        toast.error(createResult.error || "Failed to create domain");
        setIsVerifying(false);
        return;
      }

      // Step 2: Verify domain (in demo mode, this auto-verifies)
      const verifyResult = await verifyDomain(createResult.domainId!);

      if (verifyResult.success) {
        toast.success("Domain verified successfully!");
        setShowDomainDialog(false);
        setCustomDomain("");
      } else {
        toast.error(verifyResult.error || "Verification failed");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRemoveDomain = async (domainId: string) => {
    try {
      const result = await deleteDomain(domainId);
      if (result.success) {
        toast.success("Đã xóa custom domain");
        setShowDeleteDialog(false);
        setDomainToDelete(null);
      } else {
        toast.error(result.error || "Không thể xóa domain");
      }
    } catch (error: any) {
      toast.error(error.message || "Đã có lỗi xảy ra");
    }
  };

  const handleSaveSettings = () => {
    const settings = {
      email,
      displayName,
      isProfilePublic,
      showAnalytics,
      hideVielinkLogo,
      emailNotifications,
      weeklyReports,
    };
    localStorage.setItem(`settings_${user.username}`, JSON.stringify(settings));
    toast.success("Settings saved successfully");
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
  };

  const handleChangePassword = async () => {
    setIsSendingEmail(true);

    try {
      await authService.sendPasswordResetEmail(user.email);

      toast.success("Password reset email sent! Check your inbox.");
      setShowPasswordDialog(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDeleteAccount = () => {
    // Attempt to delete the Firebase Auth account (best-effort).
    // We intentionally do NOT delete any Firestore data here per request.
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      toast.error("No authenticated user found. Please sign in and try again.");
      setShowDeleteDialog(false);
      return;
    }

    deleteUser(firebaseUser)
      .then(() => {
        // Clear local app data (but not touching Firestore)
        localStorage.removeItem("user");
        localStorage.removeItem(`user_${user.username}`);
        localStorage.removeItem(`links_${user.username}`);
        localStorage.removeItem(`profile_${user.username}`);
        localStorage.removeItem(`analytics_${user.username}`);
        localStorage.removeItem(`domain_${user.username}`);
        localStorage.removeItem(`settings_${user.username}`);

        toast.success("Account deleted from authentication provider");
        setShowDeleteDialog(false);
        // Call onLogout to update app state
        onLogout();
      })
      .catch((err: any) => {
        console.error("Failed to delete Firebase Auth user:", err);
        // Common error: requires recent login
        if (err?.code === "auth/requires-recent-login") {
          toast.error("Please sign in again to confirm account deletion.");
          // Force logout so user can re-authenticate
          onLogout();
        } else {
          toast.error("Failed to delete account. Please try again later.");
        }
        setShowDeleteDialog(false);
      });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-black mb-2">Settings</h2>
        <p className="text-[#676b5f]">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Custom Domain Section */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#676b5f]" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-black">Custom Domain</h3>
                <Badge
                  className="bg-gradient-to-r from-[#8129d9] to-[#d946ef] text-white border-0 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setShowPricingDialog(true)}
                >
                  <Crown className="w-3 h-3 mr-1" />
                  PRO
                </Badge>
              </div>
              <p className="text-[#676b5f] mt-1">
                Use your own domain for your Linktree page
              </p>
            </div>
          </div>
        </div>

        {userDomains && userDomains.length > 0 ? (
          <div className="space-y-3">
            {/* List of connected domains */}
            {userDomains.map((domain) => (
              <div
                key={domain.id}
                className="bg-[#f0fdf4] border border-[#86efac] rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#16a34a] mt-0.5" />
                  <div className="flex-1">
                    <p className="text-black font-medium mb-1">
                      {domain.domain}
                    </p>
                    <p className="text-[#676b5f] text-sm">
                      Bio Page ID: {domain.bioPageId.substring(0, 8)}...
                    </p>
                    <a
                      href={`https://${domain.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8129d9] hover:underline text-sm inline-flex items-center gap-1 mt-1"
                    >
                      Xem trang <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDomainToDelete(domain.id);
                      setShowDeleteDomainDialog(true);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Add more button */}
            <Button
              onClick={() => {
                if (!isPro) {
                  toast.error("Custom domains require a PRO plan");
                  setShowPricingDialog(true);
                  return;
                }
                if (bioPageId) setSelectedBioPageId(bioPageId);
                setShowDomainDialog(true);
              }}
              variant="outline"
              className="w-full"
            >
              <Globe className="w-4 h-4 mr-2" />
              Thêm Domain Khác
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#f6f7f5] rounded-lg p-4">
              <p className="text-[#676b5f] mb-2">Default URL:</p>
              <div className="flex items-center gap-2">
                <code className="text-black bg-white px-3 py-2 rounded border border-[#e0e2d9] flex-1">
                  linktr.ee/{user.username}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`linktr.ee/${user.username}`)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={() => {
                if (!isPro) {
                  toast.error("Custom domains require a PRO plan");
                  setShowPricingDialog(true);
                  return;
                }
                if (bioPageId) setSelectedBioPageId(bioPageId);
                setShowDomainDialog(true);
              }}
              className="bg-[#8129d9] hover:bg-[#7020c0] text-white"
            >
              <Globe className="w-4 h-4 mr-2" />
              Setup Custom Domain
            </Button>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-[#676b5f]" />
          <h3 className="text-black">Account Settings</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-black">Username</label>
            <input
              type="text"
              value={user.username}
              disabled
              className="w-full px-4 py-2 bg-[#f6f7f5] rounded-lg text-[#676b5f] cursor-not-allowed"
            />
            <p className="text-[#676b5f] mt-1">Username cannot be changed</p>
          </div>

          <div>
            <label className="block mb-2 text-black">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2 bg-[#f6f7f5] rounded-lg text-[#676b5f] cursor-not-allowed"
            />
            <p className="text-[#676b5f] mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block mb-2 text-sm text-[#676b5f]">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => {
                const newValue = e.target.value;
                setDisplayName(newValue);
                // Auto-save display name with debounce
                if (displayNameTimer) {
                  clearTimeout(displayNameTimer);
                }
                const timer = setTimeout(() => {
                  const settings = {
                    email,
                    displayName: newValue,
                    isProfilePublic,
                    showAnalytics,
                    hideVielinkLogo,
                    emailNotifications,
                    weeklyReports,
                  };
                  localStorage.setItem(
                    `settings_${user.username}`,
                    JSON.stringify(settings)
                  );
                  onUpdateDisplayName(newValue);
                }, 500);
                setDisplayNameTimer(timer);
              }}
              placeholder="Your Name"
              className="w-full px-4 py-2 bg-[#f6f7f5] rounded-lg text-black placeholder:text-[#676b5f]"
            />
            <p className="text-xs text-[#676b5f] mt-1">
              Changes are saved automatically
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={() => setShowPasswordDialog(true)}
              variant="outline"
              className="w-full"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <h3 className="text-black mb-6">Privacy Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black">Public Profile</p>
              <p className="text-[#676b5f]">
                Make your profile visible to everyone
              </p>
            </div>
            <Switch
              checked={isProfilePublic}
              onCheckedChange={setIsProfilePublic}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-black">Show Analytics</p>
              <p className="text-[#676b5f]">
                Display view count on your profile
              </p>
            </div>
            <Switch
              checked={showAnalytics}
              onCheckedChange={setShowAnalytics}
            />
          </div>
        </div>
      </div>

      {/* PRO Settings */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <h3 className="text-black mb-6">PRO Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black">Hide Vielink Logo</p>
              <p className="text-[#676b5f]">
                Remove the Vielink logo from your profile
              </p>
            </div>
            <Switch
              checked={hideVielinkLogo}
              onCheckedChange={(checked: boolean) => {
                setHideVielinkLogo(checked);
                // Auto-save when toggled
                const settings = {
                  email,
                  displayName,
                  isProfilePublic,
                  showAnalytics,
                  hideVielinkLogo: checked,
                  emailNotifications,
                  weeklyReports,
                };
                localStorage.setItem(
                  `settings_${user.username}`,
                  JSON.stringify(settings)
                );
                if (onSettingsChange) {
                  onSettingsChange(settings);
                }
                toast.success(
                  checked ? "VieLink logo hidden" : "VieLink logo shown"
                );
              }}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-[#676b5f]" />
          <h3 className="text-black">Notifications</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black">Email Notifications</p>
              <p className="text-[#676b5f]">
                Receive email updates about your account
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-black">Weekly Reports</p>
              <p className="text-[#676b5f]">
                Get weekly analytics reports via email
              </p>
            </div>
            <Switch
              checked={weeklyReports}
              onCheckedChange={setWeeklyReports}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSaveSettings}
        className="w-full bg-[#8129d9] hover:bg-[#7020c0] text-white"
      >
        Save All Settings
      </Button>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="w-5 h-5 text-red-500" />
          <h3 className="text-red-500">Danger Zone</h3>
        </div>

        <p className="text-[#676b5f] mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>

        <Button
          variant="outline"
          onClick={() => setShowDeleteDialog(true)}
          className="border-red-500 text-red-500 hover:bg-red-50"
        >
          Delete Account
        </Button>
      </div>

      {/* Custom Domain Setup Dialog */}
      <Dialog open={showDomainDialog} onOpenChange={setShowDomainDialog}>
        <DialogContent className="max-w-lg max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Globe className="w-6 h-6 text-[#8129d9]" />
              Thêm Custom Domain
            </DialogTitle>
            <DialogDescription className="text-base">
              Kết nối domain của bạn với bio page để visitors có thể truy cập
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable content */}
          <div className="overflow-y-auto max-h-[calc(85vh-200px)] space-y-5 pr-2">
            {/* Step 1: Enter Domain */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#8129d9] to-[#d946ef] text-white rounded-lg flex items-center justify-center font-semibold shadow-md">
                  1
                </div>
                <h4 className="text-black font-medium text-lg">
                  Nhập domain của bạn
                </h4>
              </div>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="abc123.trycloudflare.com"
                className="w-full px-4 py-3 bg-white rounded-lg text-black placeholder:text-[#9ca3af] border-2 border-[#e0e2d9] focus:border-[#8129d9] focus:outline-none transition-colors"
              />
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3">
                <p className="text-[#676b5f] text-sm">
                  💡 Dùng <strong>ngrok</strong> hoặc{" "}
                  <strong>Cloudflare Tunnel</strong> để expose localhost ra
                  internet
                </p>
              </div>
            </div>

            {/* Tutorial link */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                  <ExternalLink className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="text-black font-medium mb-1">
                    Chưa có tunnel?
                  </h5>
                  <p className="text-[#676b5f] text-sm mb-3">
                    Xem hướng dẫn cách setup tunnel để expose localhost ra
                    internet
                  </p>
                  <a
                    href="https://github.com/cloudflare/cloudflared#installation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#8129d9] hover:text-[#7020c0] font-medium text-sm transition-colors"
                  >
                    Hướng dẫn Cloudflare Tunnel{" "}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="mx-2 text-[#676b5f]">•</span>
                  <a
                    href="https://ngrok.com/docs/getting-started"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#8129d9] hover:text-[#7020c0] font-medium text-sm transition-colors"
                  >
                    Hướng dẫn ngrok <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4 mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDomainDialog(false);
                setCustomDomain("");
                setSelectedBioPageId("");
              }}
              className="px-6"
            >
              Hủy
            </Button>
            <Button
              onClick={handleVerifyDomain}
              disabled={isVerifying || !customDomain}
              className="bg-gradient-to-r from-[#8129d9] to-[#d946ef] hover:opacity-90 text-white px-8 shadow-lg"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang kết nối...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Kết nối Domain
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Domain Confirmation Dialog */}
      <Dialog
        open={showDeleteDomainDialog}
        onOpenChange={setShowDeleteDomainDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Xóa Custom Domain
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa domain này? Visitors sẽ không thể truy cập
              bio page qua domain nữa.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-800 text-sm">
              Domain sẽ bị gỡ khỏi hệ thống và không còn trỏ đến bio page của
              bạn.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDomainDialog(false);
                setDomainToDelete(null);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                if (domainToDelete) {
                  handleRemoveDomain(domainToDelete);
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Xóa Domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-800">
              All of your data will be permanently deleted, including:
            </p>
            <ul className="list-disc list-inside mt-2 text-red-700 space-y-1">
              <li>Your profile and bio</li>
              <li>All your links</li>
              <li>Analytics data</li>
              <li>Custom domain settings</li>
            </ul>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              We'll send you an email with a link to reset your password
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-[#f6f7f5] p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#8129d9] mt-0.5" />
                <div>
                  <p className="text-black font-medium mb-1">Reset via Email</p>
                  <p className="text-[#676b5f] text-sm">
                    A password reset link will be sent to{" "}
                    <strong>{user.email}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                After clicking the link in your email, you'll be able to set a
                new password.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
              disabled={isSendingEmail}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={isSendingEmail}
              className="bg-[#8129d9] hover:bg-[#7020c0]"
            >
              {isSendingEmail ? "Sending..." : "Send Reset Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pricing Dialog */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent
          className="max-w-[90vw] sm:max-w-[1400px] p-0 bg-transparent border-0 flex items-center justify-center"
          aria-describedby="pricing-description"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Select Your Plan</DialogTitle>
            <DialogDescription id="pricing-description">
              Choose the perfect pricing plan for your needs
            </DialogDescription>
          </DialogHeader>
          <Pricing
            userId={userId || internalUserId || undefined}
            onSelectPlan={(plan) => {
              toast.success(`Selected ${plan} plan!`);
              setShowPricingDialog(false);
            }}
            onClose={() => setShowPricingDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
