import { useState, useRef } from "react";
import {
  Plus,
  GripVertical,
  Trash2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  X,
  Upload,
  ShoppingBag,
  Heart,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import ProfileEditor from "./ProfileEditor";
import { EmptyState } from "./EmptyState";
import { toast } from "sonner";
import {
  ecommerceService,
  PLACEHOLDER_IMAGE,
} from "@/features/bio-page/services/ecommerceService";
import { donateService } from "@/features/bio-page/services/donateService";
import { contactService } from "@/features/bio-page/services/contactService";
import type { Block } from "@/shared/types";

interface Link {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  type?: "social" | "ecommerce" | "donate" | "contact" | "chat" | "regular";
  platform?: string;
  data?: any;
  order?: number;
}

interface User {
  username: string;
  email: string;
}

interface LinkEditorProps {
  links: Link[];
  blocks: Block[];
  user: User;
  profileImage: string;
  bio: string;
  onAddLink: (
    title: string,
    url: string,
    type?: string,
    platform?: string,
    data?: any,
    order?: number
  ) => void;
  onUpdateLink: (
    id: string,
    title: string,
    url: string,
    type?: string,
    platform?: string,
    data?: any
  ) => void;
  onDeleteLink: (id: string) => void;
  onToggleLink: (id: string) => void;
  onUpdateProfile: (profileImage: string, bio: string) => void;
  // Block operations
  onAddBlock: (
    type: "ecommerce" | "donate" | "contact" | "chat",
    title: string,
    data: Record<string, unknown>,
    order?: number
  ) => Promise<void>;
  onUpdateBlock: (
    id: string,
    title?: string,
    data?: Record<string, unknown>
  ) => Promise<void>;
  onDeleteBlock: (id: string) => Promise<void>;
  onToggleBlock: (id: string) => Promise<void>;
  // Unified move for cross-type ordering (direction or target index)
  onMoveUnified: (
    id: string,
    itemType: "link" | "block",
    directionOrTargetIndex: "up" | "down" | number
  ) => Promise<void>;
}

export default function LinkEditor({
  links,
  blocks,
  user: _user,
  profileImage,
  bio,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onToggleLink,
  onUpdateProfile,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onToggleBlock,
  onMoveUnified,
}: LinkEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [linkType, setLinkType] = useState<
    "social" | "ecommerce" | "donate" | "contact" | "chat"
  >("social");
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<{
    id: string;
    type: "link" | "block";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Create unified items list for proper ordering and drag/drop
  type UnifiedItem =
    | { type: "link"; item: Link; order: number }
    | { type: "block"; item: Block; order: number };

  const unifiedItems: UnifiedItem[] = [
    ...links.map((link, index) => ({
      type: "link" as const,
      item: link,
      order: link.order ?? index,
    })),
    ...blocks.map((block, index) => ({
      type: "block" as const,
      item: block,
      order: block.sortOrder ?? links.length + index,
    })),
  ].sort((a, b) => a.order - b.order);

  // Helper function for unified drag and drop
  const handleUnifiedDrop = async (
    targetId: string,
    targetType: "link" | "block"
  ) => {
    if (!draggedItem) return;
    if (draggedItem.id === targetId && draggedItem.type === targetType) return;

    const draggedIndex = unifiedItems.findIndex(
      (u) =>
        (u.type === "link" ? u.item.id : u.item.id) === draggedItem.id &&
        u.type === draggedItem.type
    );
    const targetIndex = unifiedItems.findIndex(
      (u) =>
        (u.type === "link" ? u.item.id : u.item.id) === targetId &&
        u.type === targetType
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    try {
      // Move directly to target position in one operation
      await onMoveUnified(draggedItem.id, draggedItem.type, targetIndex);
    } catch (error) {
      console.error("Error during drag drop:", error);
      toast.error("Failed to move item");
    }
  };

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<Link | null>(null);

  // Block states
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [blockToDelete, setBlockToDelete] = useState<Block | null>(null);
  const [deleteBlockConfirmOpen, setDeleteBlockConfirmOpen] = useState(false);

  // E-commerce form states
  const [ecommerceUrl, setEcommerceUrl] = useState("");
  const [detectedEcommercePlatform, setDetectedEcommercePlatform] = useState<
    "shopee" | "lazada" | null
  >(null);

  // Donate form states
  const [donateTitle, setDonateTitle] = useState("");
  const [donateMethod, setDonateMethod] = useState<
    "momo" | "zalopay" | "vietqr"
  >("vietqr");
  const [donateQRImage, setDonateQRImage] = useState("");
  const [donatePaymentLink, setDonatePaymentLink] = useState("");
  const [qrImagePreview, setQrImagePreview] = useState("");
  const [paymentLinkValid, setPaymentLinkValid] = useState<boolean | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Contact form states
  const [contactTitle, setContactTitle] = useState("Contact Me");
  const [contactEmail, setContactEmail] = useState("");

  // Chat form states
  const [chatTitle, setChatTitle] = useState("Chat on Zalo");
  const [chatPhoneNumber, setChatPhoneNumber] = useState("");
  const [chatMessage, setChatMessage] = useState("Hello! I need help.");

  // Error states for inline validation
  const [errors, setErrors] = useState<{
    socialTitle?: string;
    socialUrl?: string;
    ecommerceUrl?: string;
    donateTitle?: string;
    donateQR?: string;
    donatePaymentLink?: string;
    contactTitle?: string;
    contactEmail?: string;
    chatPhone?: string;
  }>({});

  // Auto-detect social media platform from URL
  const detectSocialPlatform = (url: string): string | null => {
    const lowercaseUrl = url.toLowerCase();

    if (lowercaseUrl.includes("instagram.com")) return "instagram";
    if (lowercaseUrl.includes("tiktok.com")) return "tiktok";
    if (
      lowercaseUrl.includes("facebook.com") ||
      lowercaseUrl.includes("fb.com")
    )
      return "facebook";
    if (lowercaseUrl.includes("twitter.com") || lowercaseUrl.includes("x.com"))
      return "x";
    if (lowercaseUrl.includes("pinterest.com")) return "pinterest";
    if (lowercaseUrl.includes("snapchat.com")) return "snapchat";
    if (lowercaseUrl.includes("whatsapp.com") || lowercaseUrl.includes("wa.me"))
      return "whatsapp";
    if (lowercaseUrl.includes("reddit.com")) return "reddit";
    if (lowercaseUrl.includes("twitch.tv")) return "twitch";
    if (
      lowercaseUrl.includes("youtube.com") ||
      lowercaseUrl.includes("youtu.be")
    )
      return "youtube";

    return null;
  };

  // Update URL and detect platform
  const handleUrlChange = (url: string) => {
    setNewLinkUrl(url);
    if (linkType === "social") {
      const platform = detectSocialPlatform(url);
      setDetectedPlatform(platform);
    }
  };

  // Using ecommerceService for validation and fetching product data

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate using donateService
    const validation = donateService.validateQRImage(file);
    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, donateQR: validation.error }));
      toast.error(
        validation.error ||
          "Invalid file format. Please upload .PNG, .JPG, or .JPEG only."
      );
      return;
    }

    // Clear any previous QR error
    if (errors.donateQR) {
      setErrors((prev) => ({ ...prev, donateQR: undefined }));
    }

    try {
      // Create preview using donateService
      const previewUrl = await donateService.createImagePreview(file);
      setQrImagePreview(previewUrl);
      setDonateQRImage(previewUrl);
    } catch (error) {
      console.error("[LinkEditor] Image preview error:", error);
      toast.error("Failed to load image preview.");
    }
  };

  const handleRemoveImage = () => {
    setQrImagePreview("");
    setDonateQRImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Clear QR error when removing image
    if (errors.donateQR) {
      setErrors((prev) => ({ ...prev, donateQR: undefined }));
    }
  };

  const resetForm = () => {
    setNewLinkTitle("");
    setNewLinkUrl("");
    setDetectedPlatform(null);
    setEditingLink(null);
    setEditingBlock(null);
    setEcommerceUrl("");
    setDetectedEcommercePlatform(null);
    setDonateTitle("");
    setDonateMethod("vietqr");
    setDonateQRImage("");
    setDonatePaymentLink("");
    setQrImagePreview("");
    setPaymentLinkValid(null);
    setContactTitle("Contact Me");
    setContactEmail("");
    setChatTitle("Chat on Zalo");
    setChatPhoneNumber("");
    setChatMessage("Hello! I need help.");
    setIsLoading(false);
    setErrors({});
  };

  // =============================================================================
  // HELPER FUNCTIONS
  // =============================================================================

  /** Map linkType to block type. Returns null for 'social' (which is a link, not block) */
  const getBlockTypeFromLinkType = (
    lt: string
  ): "ecommerce" | "donate" | "contact" | "chat" | null => {
    if (lt === "ecommerce") return "ecommerce";
    if (lt === "donate") return "donate";
    if (lt === "contact") return "contact";
    if (lt === "chat") return "chat";
    return null;
  };

  /** Validate and create block data based on type. Returns null if validation fails. */
  const validateAndBuildBlockData = async (
    blockType: "ecommerce" | "donate" | "contact" | "chat"
  ): Promise<{
    title: string;
    data: Record<string, unknown>;
    message: string;
  } | null> => {
    if (blockType === "donate") {
      const validation = donateService.validateBlock({
        title: donateTitle,
        method: donateMethod,
        qrImage: donateMethod === "vietqr" ? donateQRImage : undefined,
        paymentLink: donateMethod !== "vietqr" ? donatePaymentLink : undefined,
      });
      if (!validation.isValid) {
        setErrors({ [validation.field as string]: validation.error });
        return null;
      }
      const methodName =
        donateMethod === "vietqr"
          ? "VietQR"
          : donateMethod === "momo"
          ? "Momo"
          : "ZaloPay";
      return {
        title: donateTitle,
        data: {
          method: donateMethod,
          qrImage: donateMethod === "vietqr" ? donateQRImage : null,
          paymentLink: donateMethod !== "vietqr" ? donatePaymentLink : null,
        },
        message: `Donate button "${donateTitle}" with ${methodName} payment`,
      };
    }

    if (blockType === "contact") {
      const validation = contactService.validateConfig({
        title: contactTitle,
        receiverEmail: contactEmail,
      });
      if (!validation.isValid) {
        setErrors({
          [validation.field === "title" ? "contactTitle" : "contactEmail"]:
            validation.error,
        });
        return null;
      }
      return {
        title: contactTitle,
        data: { title: contactTitle, receiverEmail: contactEmail },
        message: `Contact form "${contactTitle}" (sends to ${contactEmail})`,
      };
    }

    if (blockType === "ecommerce") {
      if (!ecommerceUrl.trim()) {
        setErrors({ ecommerceUrl: "Please enter a product URL" });
        return null;
      }
      const validation = ecommerceService.validateUrl(ecommerceUrl);
      if (!validation.isValid) {
        setErrors({
          ecommerceUrl: validation.error || "URL is not supported.",
        });
        return null;
      }
      const result = await ecommerceService.fetchProduct(ecommerceUrl);
      if (!result.success || !result.data) {
        setErrors({
          ecommerceUrl:
            result.error || "Unable to retrieve product information.",
        });
        return null;
      }
      const productData = {
        ...result.data,
        image: result.data.image || PLACEHOLDER_IMAGE,
        platform: validation.platform,
      };
      return {
        title: productData.title,
        data: productData,
        message: `Product "${productData.title}" from ${validation.platform}`,
      };
    }

    if (blockType === "chat") {
      if (!chatPhoneNumber.trim()) {
        setErrors({ chatPhone: "Please enter a Zalo phone number" });
        return null;
      }
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(chatPhoneNumber.trim())) {
        setErrors({
          chatPhone:
            "Invalid phone number. Please enter 10 digits starting with 0.",
        });
        return null;
      }
      const finalTitle = chatTitle.trim() || "Chat on Zalo";
      return {
        title: finalTitle,
        data: {
          title: finalTitle,
          phoneNumber: chatPhoneNumber,
          message: chatMessage,
        },
        message: `Zalo chat "${finalTitle}" (${chatPhoneNumber})`,
      };
    }

    return null;
  };

  /** Validate social link data */
  const validateSocialLink = (): { title: string; url: string } | null => {
    const newErrors: Record<string, string> = {};
    if (!newLinkTitle.trim()) newErrors.socialTitle = "Please enter a title";
    if (!newLinkUrl.trim()) newErrors.socialUrl = "Please enter a URL";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return null;
    }
    return { title: newLinkTitle, url: newLinkUrl };
  };

  // =============================================================================
  // ADD HANDLERS
  // =============================================================================

  const handleAddLink = async () => {
    // Clear previous errors
    setErrors({});

    if (linkType === "social") {
      const newErrors: any = {};
      if (!newLinkTitle.trim()) {
        newErrors.socialTitle = "Please enter a title";
      }
      if (!newLinkUrl.trim()) {
        newErrors.socialUrl = "Please enter a URL";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const platform = detectedPlatform;
      onAddLink(newLinkTitle, newLinkUrl, "social", platform || undefined);
      toast.success(`Social link "${newLinkTitle}" added successfully!`);
      resetForm();
      setIsDialogOpen(false);
    } else if (linkType === "ecommerce") {
      const newErrors: any = {};

      if (!ecommerceUrl.trim()) {
        newErrors.ecommerceUrl = "Please enter a product URL";
        setErrors(newErrors);
        return;
      }

      // Validate URL using ecommerceService
      const validation = ecommerceService.validateUrl(ecommerceUrl);
      if (!validation.isValid) {
        newErrors.ecommerceUrl =
          validation.error ||
          "URL is not supported. Please use a link from Shopee or Lazada.";
        setErrors(newErrors);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch product data using ecommerceService
        const result = await ecommerceService.fetchProduct(ecommerceUrl);

        if (!result.success || !result.data) {
          newErrors.ecommerceUrl =
            result.error ||
            "Unable to retrieve product information. Please check the URL or try again later.";
          setErrors(newErrors);
          setIsLoading(false);
          return;
        }

        // Use placeholder image if no image is found
        const productData = {
          ...result.data,
          image: result.data.image || PLACEHOLDER_IMAGE,
        };

        // Add as block (not link) for proper storage
        await onAddBlock("ecommerce", productData.title, {
          ...productData,
          platform: validation.platform,
        });
        toast.success(
          `Product "${productData.title}" from ${validation.platform
            ?.charAt(0)
            .toUpperCase()}${validation.platform?.slice(1)} added successfully!`
        );
        resetForm();
        setIsDialogOpen(false);
      } catch (error) {
        newErrors.ecommerceUrl =
          "Unable to retrieve product information. Please check the URL or try again later.";
        setErrors(newErrors);
      } finally {
        setIsLoading(false);
      }
    } else if (linkType === "donate") {
      const newErrors: any = {};

      // Validate using donateService
      const validation = donateService.validateBlock({
        title: donateTitle,
        method: donateMethod,
        qrImage: donateMethod === "vietqr" ? donateQRImage : undefined,
        paymentLink: donateMethod !== "vietqr" ? donatePaymentLink : undefined,
      });

      if (!validation.isValid) {
        if (validation.field === "title") {
          newErrors.donateTitle = validation.error;
        } else if (validation.field === "qrImage") {
          newErrors.donateQR = validation.error;
        } else if (validation.field === "paymentLink") {
          newErrors.donatePaymentLink = validation.error;
        }
        setErrors(newErrors);
        return;
      }

      // Additional payment link validation for Momo/ZaloPay
      if (donateMethod !== "vietqr") {
        const linkValidation = donateService.validatePaymentLink(
          donatePaymentLink,
          donateMethod
        );
        if (!linkValidation.isValid) {
          newErrors.donatePaymentLink = linkValidation.error;
          setErrors(newErrors);
          return;
        }
      }

      // Build data object without undefined fields (Firestore doesn't accept undefined)
      const donateData: Record<string, unknown> = {
        title: donateTitle,
        method: donateMethod,
      };
      if (donateMethod === "vietqr" && donateQRImage) {
        donateData.qrImage = donateQRImage;
      }
      if (donateMethod !== "vietqr" && donatePaymentLink) {
        donateData.paymentLink = donatePaymentLink;
      }

      // Add as block (not link) for proper storage
      setIsLoading(true);
      try {
        const methodName =
          donateMethod === "vietqr"
            ? "VietQR"
            : donateMethod === "momo"
            ? "Momo"
            : "ZaloPay";
        await onAddBlock("donate", donateTitle, donateData);
        toast.success(
          `Donate button "${donateTitle}" with ${methodName} payment added successfully!`
        );
        resetForm();
        setIsDialogOpen(false);
      } catch (error) {
        toast.error("Failed to add donate button. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else if (linkType === "contact") {
      const newErrors: any = {};

      // Validate using contactService
      const validation = contactService.validateConfig({
        title: contactTitle,
        receiverEmail: contactEmail,
      });

      if (!validation.isValid) {
        if (validation.field === "title") {
          newErrors.contactTitle = validation.error;
        } else if (validation.field === "receiverEmail") {
          newErrors.contactEmail = validation.error;
        }
        setErrors(newErrors);
        return;
      }

      const contactData = {
        title: contactTitle,
        receiverEmail: contactEmail,
      };

      // Add as block (not link) for proper storage
      setIsLoading(true);
      try {
        await onAddBlock("contact", contactTitle, contactData);
        toast.success(
          `Contact form "${contactTitle}" (sends to ${contactEmail}) added successfully!`
        );
        resetForm();
        setIsDialogOpen(false);
      } catch (error) {
        toast.error("Failed to add contact form. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else if (linkType === "chat") {
      const newErrors: any = {};

      if (!chatPhoneNumber.trim()) {
        newErrors.chatPhone = "Please enter a Zalo phone number";
      } else {
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(chatPhoneNumber.trim())) {
          newErrors.chatPhone =
            "Invalid phone number. Please enter 10 digits starting with 0.";
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const finalTitle = chatTitle.trim() || "Chat on Zalo";
      const chatData = {
        title: finalTitle,
        phoneNumber: chatPhoneNumber,
        message: chatMessage,
      };

      const zaloUrl = `https://zalo.me/${chatPhoneNumber}`;
      onAddLink(finalTitle, zaloUrl, "chat", undefined, chatData);
      toast.success(
        `Zalo chat button "${finalTitle}" (${chatPhoneNumber}) added successfully!`
      );
      resetForm();
      setIsDialogOpen(false);
    }
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    // Cast type to valid linkType, default to 'social' if 'regular' or undefined
    const validType =
      link.type === "regular" ? "social" : link.type || "social";
    setLinkType(
      validType as "social" | "ecommerce" | "donate" | "contact" | "chat"
    );
    setIsDialogOpen(true);

    // Load data based on link type
    if (link.type === "social") {
      setNewLinkTitle(link.title);
      setNewLinkUrl(link.url);
      setDetectedPlatform(link.platform || null);
    } else if (link.type === "ecommerce") {
      setEcommerceUrl(link.data?.url || link.url || "");
      setDetectedEcommercePlatform(
        (link.platform as "shopee" | "lazada") || null
      );
    } else if (link.type === "donate") {
      setDonateTitle(link.data?.title || link.title || "");
      setDonateMethod(link.data?.method || "vietqr");
      if (link.data?.method === "vietqr" && link.data?.qrImage) {
        setDonateQRImage(link.data.qrImage);
        setQrImagePreview(link.data.qrImage);
      } else {
        setDonatePaymentLink(link.data?.paymentLink || "");
      }
    } else if (link.type === "contact") {
      setContactTitle(link.data?.title || link.title || "Contact Me");
      setContactEmail(link.data?.receiverEmail || "");
    } else if (link.type === "chat") {
      setChatTitle(link.data?.title || link.title || "Chat on Zalo");
      setChatPhoneNumber(link.data?.phoneNumber || "");
      setChatMessage(link.data?.message || "Hello! I need help.");
    }
  };

  // =============================================================================
  // UPDATE LINK HANDLER
  // =============================================================================
  const handleUpdateLink = async () => {
    if (!editingLink) return;

    setErrors({});

    const originalLinkType = editingLink.type || "social";
    const isTypeChanged = linkType !== originalLinkType;
    const newBlockType = getBlockTypeFromLinkType(linkType);

    // Get order from editingLink.order, or calculate from current position in unifiedItems
    const currentPosition = unifiedItems.findIndex(
      (u) => u.type === "link" && u.item.id === editingLink.id
    );
    const preserveOrder =
      editingLink.order ??
      (currentPosition >= 0 ? unifiedItems[currentPosition].order : 0);

    // Case 1: Converting link to a block type
    if (isTypeChanged && newBlockType) {
      setIsLoading(true);
      try {
        const blockData = await validateAndBuildBlockData(newBlockType);
        if (!blockData) {
          setIsLoading(false);
          return;
        }

        // Delete old link and create new block with same order
        onDeleteLink(editingLink.id);
        await onAddBlock(
          newBlockType,
          blockData.title,
          blockData.data,
          preserveOrder
        );

        toast.success(`Converted to ${blockData.message}!`);
        resetForm();
        setIsDialogOpen(false);
      } catch (error) {
        toast.error("Failed to convert. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Case 2: Update social link (same type or different social variations)
    if (linkType === "social") {
      const linkData = validateSocialLink();
      if (!linkData) return;

      onUpdateLink(
        editingLink.id,
        linkData.title,
        linkData.url,
        "social",
        detectedPlatform || undefined
      );
      toast.success(`Social link updated to "${linkData.title}"!`);
      resetForm();
      setIsDialogOpen(false);
      return;
    }

    // Case 3: Update non-social link types (legacy support)
    // For links stored in links collection with types like donate, contact, etc.
    setIsLoading(true);
    try {
      const blockData = await validateAndBuildBlockData(
        linkType as "ecommerce" | "donate" | "contact" | "chat"
      );
      if (!blockData) {
        setIsLoading(false);
        return;
      }

      // Update link with new data
      const url =
        linkType === "chat" ? `https://zalo.me/${chatPhoneNumber}` : "";
      onUpdateLink(
        editingLink.id,
        blockData.title,
        url,
        linkType,
        undefined,
        blockData.data
      );
      toast.success(`${blockData.message} updated!`);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getLinkTypeDisplay = (link: Link) => {
    if (link.type === "ecommerce") {
      return (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}>
            <img
              src={link.data?.image}
              alt={link.title}
              className="w-10 h-10 rounded-md object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{link.title}</p>
            <p className="text-sm text-orange-600 font-medium">
              {link.data?.price} <span className="text-gray-400">• {link.data?.platform}</span>
            </p>
          </div>
        </div>
      );
    } else if (link.type === "donate") {
      return (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
            <Heart className="w-5 h-5" style={{ color: '#ffffff', fill: '#ffffff' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{link.title}</p>
            <p className="text-sm text-pink-600 font-medium">
              {link.data?.method === "vietqr"
                ? "VietQR"
                : link.data?.method === "momo"
                ? "Momo"
                : "ZaloPay"}{" "}
              <span className="text-gray-400">payment</span>
            </p>
          </div>
        </div>
      );
    } else if (link.type === "contact") {
      return (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
            <Mail className="w-5 h-5" style={{ color: '#ffffff' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{link.title}</p>
            <p className="text-sm text-blue-600 font-medium truncate">
              <span className="text-gray-400">To:</span> {link.data?.receiverEmail}
            </p>
          </div>
        </div>
      );
    } else if (link.type === "chat") {
      return (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <MessageCircle className="w-5 h-5" style={{ color: '#ffffff' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{link.title}</p>
            <p className="text-sm text-green-600 font-medium">{link.data?.phoneNumber}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}>
            <ExternalLink className="w-5 h-5" style={{ color: '#ffffff' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{link.title}</p>
            <p className="text-sm text-purple-600 font-medium truncate">
              {link.url}
            </p>
          </div>
        </div>
      );
    }
  };

  // Get display for blocks (similar to links)
  const getBlockTypeDisplay = (block: Block) => {
    if (block.type === "ecommerce") {
      const data = block.data as any;
      return (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}>
            <img
              src={data?.image || PLACEHOLDER_IMAGE}
              alt={block.title}
              className="w-10 h-10 rounded-md object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{block.title}</p>
            <p className="text-sm text-orange-600 font-medium">
              {data?.price || "N/A"} <span className="text-gray-400">• {data?.platform || "E-commerce"}</span>
            </p>
          </div>
        </div>
      );
    } else if (block.type === "donate") {
      const data = block.data as any;
      return (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
            <Heart className="w-5 h-5" style={{ color: '#ffffff', fill: '#ffffff' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{block.title}</p>
            <p className="text-sm text-pink-600 font-medium">
              {data?.method === "vietqr"
                ? "VietQR"
                : data?.method === "momo"
                ? "Momo"
                : "ZaloPay"}{" "}
              <span className="text-gray-400">payment</span>
            </p>
          </div>
        </div>
      );
    } else if (block.type === "contact") {
      const data = block.data as any;
      return (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
            <Mail className="w-5 h-5" style={{ color: '#ffffff' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{block.title}</p>
            <p className="text-sm text-blue-600 font-medium truncate">
              <span className="text-gray-400">To:</span> {data?.receiverEmail || "N/A"}
            </p>
          </div>
        </div>
      );
    } else if (block.type === "chat") {
      const data = block.data as any;
      return (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <MessageCircle className="w-5 h-5" style={{ color: '#ffffff' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{block.title}</p>
            <p className="text-sm text-green-600 font-medium">
              {data?.phoneNumber || "N/A"}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Handle edit block (opens dialog with block data)
  const handleEditBlock = (block: Block) => {
    setEditingBlock(block);

    if (block.type === "donate") {
      const data = block.data as any;
      setDonateTitle(block.title);
      setDonateMethod(data?.method || "vietqr");
      setDonateQRImage(data?.qrImage || "");
      setQrImagePreview(data?.qrImage || "");
      setDonatePaymentLink(data?.paymentLink || "");
      setLinkType("donate");
    } else if (block.type === "contact") {
      const data = block.data as any;
      setContactTitle(block.title);
      setContactEmail(data?.receiverEmail || "");
      setLinkType("contact");
    } else if (block.type === "chat") {
      const data = block.data as any;
      setChatTitle(block.title);
      setChatPhoneNumber(data?.phoneNumber || "");
      setChatMessage(data?.defaultMessage || "Hello! I need help.");
      setLinkType("chat");
    } else if (block.type === "ecommerce") {
      const data = block.data as any;
      setEcommerceUrl(data?.url || "");
      setDetectedEcommercePlatform(
        (data?.platform as "shopee" | "lazada") || null
      );
      setLinkType("ecommerce");
    }

    setIsDialogOpen(true);
  };

  // Handle update block (or convert to different type)
  const handleUpdateBlock = async () => {
    if (!editingBlock) return;

    setErrors({});
    const newBlockType = getBlockTypeFromLinkType(linkType);
    const originalBlockType = editingBlock.type;
    const isTypeChanged = newBlockType !== originalBlockType;
    const isConvertingToLink = linkType === "social";

    // Get order from editingBlock.sortOrder, or calculate from current position in unifiedItems
    const currentPosition = unifiedItems.findIndex(
      (u) => u.type === "block" && u.item.id === editingBlock.id
    );
    const preserveOrder =
      editingBlock.sortOrder ??
      (currentPosition >= 0 ? unifiedItems[currentPosition].order : 0);

    // Case 1: Converting to link (social type)
    if (isConvertingToLink) {
      const linkData = validateSocialLink();
      if (!linkData) return;

      setIsLoading(true);
      try {
        await onDeleteBlock(editingBlock.id);
        onAddLink(
          linkData.title,
          linkData.url,
          "social",
          detectedPlatform || undefined,
          undefined,
          preserveOrder
        );
        toast.success(`Converted to link "${linkData.title}" successfully!`);
        resetForm();
        setEditingBlock(null);
        setIsDialogOpen(false);
      } catch (error) {
        toast.error("Failed to convert. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Case 2: Block type changed (but still a block)
    if (isTypeChanged && newBlockType) {
      const blockData = await validateAndBuildBlockData(newBlockType);
      if (!blockData) return;

      setIsLoading(true);
      try {
        await onDeleteBlock(editingBlock.id);
        await onAddBlock(
          newBlockType,
          blockData.title,
          blockData.data,
          preserveOrder
        );
        toast.success(`Converted to ${blockData.message}!`);
        resetForm();
        setEditingBlock(null);
        setIsDialogOpen(false);
      } catch (error) {
        toast.error("Failed to convert. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Case 3: Same type - just update
    const blockData = await validateAndBuildBlockData(
      originalBlockType as "ecommerce" | "donate" | "contact" | "chat"
    );
    if (!blockData) return;

    setIsLoading(true);
    try {
      await onUpdateBlock(editingBlock.id, blockData.title, blockData.data);
      toast.success(`${blockData.message} updated!`);
      resetForm();
      setEditingBlock(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] border border-white/50">
      <div className="space-y-6">
        {/* Profile Editor with Upload */}
        <ProfileEditor
          profileImage={profileImage}
          bio={bio}
          onUpdateProfile={onUpdateProfile}
        />

        {/* Add New Item Button */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open: boolean) => {
            setIsDialogOpen(open);
            if (!open) {
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-[#8129d9] to-[#d946ef] hover:from-[#6f23b8] hover:to-[#c133d9] text-white rounded-xl py-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="w-5 h-5 mr-2" />
              <span className="font-semibold">Add Link or Block</span>
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-2xl max-h-[90vh] overflow-y-auto"
            aria-describedby="add-link-description"
          >
            <DialogHeader>
              <DialogTitle>
                {editingBlock
                  ? "Edit Block"
                  : editingLink
                  ? editingLink.type === "social" ||
                    editingLink.type === "regular"
                    ? "Edit Link"
                    : "Edit Block"
                  : linkType === "social"
                  ? "Add New Link"
                  : "Add New Block"}
              </DialogTitle>
            </DialogHeader>
            <p id="add-link-description" className="sr-only">
              {editingBlock || editingLink
                ? "Edit your existing item"
                : "Add a new item to your profile"}
            </p>

            {/* Link Type Cards */}
            <div className="mt-5">
              <p className="text-sm font-medium text-gray-600 mb-2">Select type</p>
              <div className="grid grid-cols-5 gap-2">
                {/* Social Link */}
                <button
                  onClick={() => setLinkType("social")}
                  className={`group p-2.5 rounded-xl border-2 transition-all duration-200 text-center ${
                    linkType === "social"
                      ? "border-purple-500 bg-purple-50 shadow-sm"
                      : "border-gray-200 hover:border-purple-300 bg-white"
                  }`}
                >
                  <div className={`w-10 h-10 mx-auto mb-1.5 rounded-lg flex items-center justify-center ${
                    linkType === "social" ? "bg-purple-100" : "bg-gray-100 group-hover:bg-purple-50"
                  }`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={linkType === "social" ? "#9333ea" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                  <p className={`text-[11px] font-medium ${linkType === "social" ? "text-purple-600" : "text-gray-500"}`}>Social</p>
                </button>

                {/* Product */}
                <button
                  onClick={() => setLinkType("ecommerce")}
                  className={`group p-2.5 rounded-xl border-2 transition-all duration-200 text-center ${
                    linkType === "ecommerce"
                      ? "border-orange-500 bg-orange-50 shadow-sm"
                      : "border-gray-200 hover:border-orange-300 bg-white"
                  }`}
                >
                  <div className={`w-10 h-10 mx-auto mb-1.5 rounded-lg flex items-center justify-center ${
                    linkType === "ecommerce" ? "bg-orange-100" : "bg-gray-100 group-hover:bg-orange-50"
                  }`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={linkType === "ecommerce" ? "#ea580c" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </div>
                  <p className={`text-[11px] font-medium ${linkType === "ecommerce" ? "text-orange-600" : "text-gray-500"}`}>Product</p>
                </button>

                {/* Donate */}
                <button
                  onClick={() => setLinkType("donate")}
                  className={`group p-2.5 rounded-xl border-2 transition-all duration-200 text-center ${
                    linkType === "donate"
                      ? "border-pink-500 bg-pink-50 shadow-sm"
                      : "border-gray-200 hover:border-pink-300 bg-white"
                  }`}
                >
                  <div className={`w-10 h-10 mx-auto mb-1.5 rounded-lg flex items-center justify-center ${
                    linkType === "donate" ? "bg-pink-100" : "bg-gray-100 group-hover:bg-pink-50"
                  }`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={linkType === "donate" ? "#ec4899" : "none"} stroke={linkType === "donate" ? "#db2777" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <p className={`text-[11px] font-medium ${linkType === "donate" ? "text-pink-600" : "text-gray-500"}`}>Donate</p>
                </button>

                {/* Contact */}
                <button
                  onClick={() => setLinkType("contact")}
                  className={`group p-2.5 rounded-xl border-2 transition-all duration-200 text-center ${
                    linkType === "contact"
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-blue-300 bg-white"
                  }`}
                >
                  <div className={`w-10 h-10 mx-auto mb-1.5 rounded-lg flex items-center justify-center ${
                    linkType === "contact" ? "bg-blue-100" : "bg-gray-100 group-hover:bg-blue-50"
                  }`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={linkType === "contact" ? "#2563eb" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <p className={`text-[11px] font-medium ${linkType === "contact" ? "text-blue-600" : "text-gray-500"}`}>Contact</p>
                </button>

                {/* Chat */}
                <button
                  onClick={() => setLinkType("chat")}
                  className={`group p-2.5 rounded-xl border-2 transition-all duration-200 text-center ${
                    linkType === "chat"
                      ? "border-green-500 bg-green-50 shadow-sm"
                      : "border-gray-200 hover:border-green-300 bg-white"
                  }`}
                >
                  <div className={`w-10 h-10 mx-auto mb-1.5 rounded-lg flex items-center justify-center ${
                    linkType === "chat" ? "bg-green-100" : "bg-gray-100 group-hover:bg-green-50"
                  }`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={linkType === "chat" ? "#16a34a" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>
                  <p className={`text-[11px] font-medium ${linkType === "chat" ? "text-green-600" : "text-gray-500"}`}>Chat</p>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm font-medium text-gray-400">Enter details</span>
              </div>
            </div>

            <div className="space-y-5">
              {/* Social Media Form */}
              {linkType === "social" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="link-title" className="text-sm font-medium text-gray-700">
                      Title
                    </Label>
                    <Input
                      id="link-title"
                      type="text"
                      value={newLinkTitle}
                      onChange={(e) => {
                        setNewLinkTitle(e.target.value);
                        if (errors.socialTitle)
                          setErrors((prev) => ({
                            ...prev,
                            socialTitle: undefined,
                          }));
                      }}
                      placeholder="e.g., Follow me on Instagram"
                      className={`h-11 rounded-lg transition-all ${
                        errors.socialTitle 
                          ? "border-red-500 focus:ring-red-500" 
                          : "focus:ring-[#8129d9] focus:border-[#8129d9]"
                      }`}
                    />
                    {errors.socialTitle && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.socialTitle}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link-url" className="text-sm font-medium text-gray-700">
                      URL
                    </Label>
                    <Input
                      id="link-url"
                      type="url"
                      value={newLinkUrl}
                      onChange={(e) => {
                        handleUrlChange(e.target.value);
                        if (errors.socialUrl)
                          setErrors((prev) => ({
                            ...prev,
                            socialUrl: undefined,
                          }));
                      }}
                      placeholder="https://instagram.com/yourname"
                      className={`h-11 rounded-lg transition-all ${
                        errors.socialUrl 
                          ? "border-red-500 focus:ring-red-500" 
                          : "focus:ring-[#8129d9] focus:border-[#8129d9]"
                      }`}
                    />
                    {detectedPlatform && (
                      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="font-medium">
                          Detected: {detectedPlatform.charAt(0).toUpperCase() + detectedPlatform.slice(1)}
                        </span>
                      </div>
                    )}
                    {newLinkUrl && !detectedPlatform && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                        <span>Platform not detected - will display as regular link</span>
                      </div>
                    )}
                    {errors.socialUrl && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.socialUrl}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* E-commerce Form */}
              {linkType === "ecommerce" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-url" className="text-sm font-medium text-gray-700">
                      Product URL
                    </Label>
                    <Input
                      id="product-url"
                      type="url"
                      placeholder="https://shopee.vn/... or https://lazada.vn/..."
                      value={ecommerceUrl}
                      onChange={(e) => {
                        const url = e.target.value;
                        setEcommerceUrl(url);
                        if (errors.ecommerceUrl)
                          setErrors((prev) => ({
                            ...prev,
                            ecommerceUrl: undefined,
                          }));
                        if (url) {
                          const validation = ecommerceService.validateUrl(url);
                          setDetectedEcommercePlatform(
                            validation.platform || null
                          );
                        } else {
                          setDetectedEcommercePlatform(null);
                        }
                      }}
                      disabled={isLoading}
                      className={`h-11 rounded-lg transition-all ${
                        errors.ecommerceUrl 
                          ? "border-red-500 focus:ring-red-500" 
                          : "focus:ring-orange-500 focus:border-orange-500"
                      }`}
                    />
                    {!errors.ecommerceUrl && (
                      <p className="text-xs text-gray-500">
                        Paste product link from Shopee or Lazada
                      </p>
                    )}
                    {detectedEcommercePlatform && (
                      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="font-medium">
                          Detected: {detectedEcommercePlatform.charAt(0).toUpperCase() + detectedEcommercePlatform.slice(1)}
                        </span>
                      </div>
                    )}
                    {errors.ecommerceUrl && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.ecommerceUrl}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Donate Form */}
              {linkType === "donate" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="donate-title" className="text-sm font-medium text-gray-700">
                      Button Title *
                    </Label>
                    <Input
                      id="donate-title"
                      type="text"
                      placeholder="e.g., Support Me"
                      value={donateTitle}
                      onChange={(e) => {
                        setDonateTitle(e.target.value);
                        if (errors.donateTitle)
                          setErrors((prev) => ({
                            ...prev,
                            donateTitle: undefined,
                          }));
                      }}
                      className={`h-11 rounded-lg transition-all ${
                        errors.donateTitle 
                          ? "border-red-500 focus:ring-red-500" 
                          : "focus:ring-pink-500 focus:border-pink-500"
                      }`}
                    />
                    {errors.donateTitle && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.donateTitle}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-method" className="text-sm font-medium text-gray-700">
                      Payment Method *
                    </Label>
                    <Select
                      value={donateMethod}
                      onValueChange={(value: any) => setDonateMethod(value)}
                    >
                      <SelectTrigger id="payment-method" className="h-11 rounded-lg">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vietqr">VietQR</SelectItem>
                        <SelectItem value="momo">Momo</SelectItem>
                        <SelectItem value="zalopay">ZaloPay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {donateMethod === "vietqr" ? (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">QR Code Image *</Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpg,image/jpeg"
                        onChange={(e) => {
                          handleImageUpload(e);
                          if (errors.donateQR)
                            setErrors((prev) => ({
                              ...prev,
                              donateQR: undefined,
                            }));
                        }}
                        className="hidden"
                      />

                      {qrImagePreview ? (
                        <div className="relative group">
                          <img
                            src={qrImagePreview}
                            alt="QR Code Preview"
                            className="w-full h-48 object-contain bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200"
                          />
                          <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className={`w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:bg-pink-50 hover:border-pink-400 ${
                            errors.donateQR
                              ? "border-red-400 bg-red-50"
                              : "border-gray-300 bg-gray-50"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-pink-500" />
                          </div>
                          <p className="text-sm font-medium text-gray-700">
                            Click to upload QR image
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, JPEG (Max 5MB)
                          </p>
                        </button>
                      )}
                      {errors.donateQR && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          {errors.donateQR}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="payment-link" className="text-sm font-medium text-gray-700">
                        {donateMethod === "momo"
                          ? "Momo Payment Link"
                          : "ZaloPay Payment Link"}{" "}
                        *
                      </Label>
                      <Input
                        id="payment-link"
                        type="url"
                        placeholder={
                          donateMethod === "momo"
                            ? "https://me.momo.vn/..."
                            : "https://zalopay.vn/..."
                        }
                        value={donatePaymentLink}
                        onChange={(e) => {
                          const link = e.target.value;
                          setDonatePaymentLink(link);
                          if (errors.donatePaymentLink)
                            setErrors((prev) => ({
                              ...prev,
                              donatePaymentLink: undefined,
                            }));
                          if (link) {
                            if (donateMethod === "momo") {
                              setPaymentLinkValid(
                                link.includes("me.momo.vn") ||
                                  link.includes("momo.vn")
                              );
                            } else {
                              setPaymentLinkValid(link.includes("zalopay.vn"));
                            }
                          } else {
                            setPaymentLinkValid(null);
                          }
                        }}
                        className={`h-11 rounded-lg transition-all ${
                          errors.donatePaymentLink 
                            ? "border-red-500 focus:ring-red-500" 
                            : "focus:ring-pink-500 focus:border-pink-500"
                        }`}
                      />
                      {!errors.donatePaymentLink && (
                        <p className="text-xs text-gray-500">
                          {donateMethod === "momo"
                            ? "Your Momo link (opens app on mobile)"
                            : "Your ZaloPay link (opens app on mobile)"}
                        </p>
                      )}
                      {paymentLinkValid === true &&
                        !errors.donatePaymentLink && (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="font-medium">
                              Valid {donateMethod === "momo" ? "Momo" : "ZaloPay"} link detected
                            </span>
                          </div>
                        )}
                      {errors.donatePaymentLink && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          {errors.donatePaymentLink}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Contact Form */}
              {linkType === "contact" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-title" className="text-sm font-medium text-gray-700">
                      Form Title *
                    </Label>
                    <Input
                      id="contact-title"
                      type="text"
                      placeholder="e.g., Contact Me"
                      value={contactTitle}
                      onChange={(e) => {
                        setContactTitle(e.target.value);
                        if (errors.contactTitle)
                          setErrors((prev) => ({
                            ...prev,
                            contactTitle: undefined,
                          }));
                      }}
                      className={`h-11 rounded-lg transition-all ${
                        errors.contactTitle 
                          ? "border-red-500 focus:ring-red-500" 
                          : "focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    />
                    {errors.contactTitle && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.contactTitle}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-sm font-medium text-gray-700">
                      Your Email *
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="email@example.com"
                      value={contactEmail}
                      onChange={(e) => {
                        setContactEmail(e.target.value);
                        if (errors.contactEmail)
                          setErrors((prev) => ({
                            ...prev,
                            contactEmail: undefined,
                          }));
                      }}
                      className={`h-11 rounded-lg transition-all ${
                        errors.contactEmail 
                          ? "border-red-500 focus:ring-red-500" 
                          : "focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    />
                    {!errors.contactEmail && (
                      <p className="text-xs text-gray-500">
                        Messages from visitors will be sent to this email
                      </p>
                    )}
                    {errors.contactEmail && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.contactEmail}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Chat Form */}
              {linkType === "chat" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="chat-title" className="text-sm font-medium text-gray-700">
                      Button Title
                    </Label>
                    <Input
                      id="chat-title"
                      type="text"
                      placeholder="Chat on Zalo"
                      value={chatTitle}
                      onChange={(e) => setChatTitle(e.target.value)}
                      className="h-11 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500">
                      Leave empty to use default title
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone-number" className="text-sm font-medium text-gray-700">
                      Zalo Phone Number *
                    </Label>
                    <Input
                      id="phone-number"
                      type="tel"
                      placeholder="0123456789"
                      value={chatPhoneNumber}
                      onChange={(e) => {
                        setChatPhoneNumber(e.target.value);
                        if (errors.chatPhone)
                          setErrors((prev) => ({
                            ...prev,
                            chatPhone: undefined,
                          }));
                      }}
                      className={`h-11 rounded-lg transition-all ${
                        errors.chatPhone 
                          ? "border-red-500 focus:ring-red-500" 
                          : "focus:ring-green-500 focus:border-green-500"
                      }`}
                    />
                    {!errors.chatPhone && (
                      <p className="text-xs text-gray-500">
                        10 digits starting with 0
                      </p>
                    )}
                    {errors.chatPhone && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.chatPhone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chat-message" className="text-sm font-medium text-gray-700">
                      Default Message
                    </Label>
                    <Input
                      id="chat-message"
                      type="text"
                      placeholder="Hello! I need help."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="h-11 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  onClick={
                    editingBlock
                      ? handleUpdateBlock
                      : editingLink
                      ? handleUpdateLink
                      : handleAddLink
                  }
                  className="w-full h-12 bg-gradient-to-r from-[#8129d9] to-[#a855f7] hover:from-[#6f23b8] hover:to-[#9333ea] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : editingBlock ? (
                    <span className="flex items-center gap-2">
                      <span>Update Block</span>
                    </span>
                  ) : editingLink ? (
                    linkType === "social" ? (
                      <span className="flex items-center gap-2">
                        <span>Update Link</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span>Update Block</span>
                      </span>
                    )
                  ) : linkType === "social" ? (
                    <span className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      <span>Add Link</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      <span>Add Block</span>
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Unified Items List (Links + Blocks) */}
        <div className="space-y-3">
          {unifiedItems.length === 0 ? (
            <EmptyState
              title="No links yet"
              description="Create your first link to start sharing with the world"
              actionLabel="Create link"
              onAction={() => setIsDialogOpen(true)}
            />
          ) : (
            <>
              {/* Render Unified Items */}
              {unifiedItems.map((unifiedItem) => {
                if (unifiedItem.type === "link") {
                  const link = unifiedItem.item;
                  return (
                    <div
                      key={`link-${link.id}`}
                      className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-4 border-2 border-gray-200/60 shadow-sm hover:shadow-xl hover:border-purple-300 hover:-translate-y-0.5 transition-all duration-300 group backdrop-blur-sm"
                      draggable
                      onDragStart={(e) => {
                        setDraggedItem({ id: link.id, type: "link" });
                        e.currentTarget.classList.add("opacity-50");
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.classList.remove("opacity-50");
                        setDraggedItem(null);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        await handleUnifiedDrop(link.id, "link");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          className="cursor-grab hover:bg-gray-100 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <GripVertical className="w-5 h-5 text-[#9ca3af]" />
                        </button>

                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleEditLink(link)}
                        >
                          {getLinkTypeDisplay(link)}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Move Up/Down Buttons - Unified ordering */}
                          {unifiedItems.length > 1 && (
                            <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await onMoveUnified(link.id, "link", "up");
                                  } catch (error) {
                                    console.error(
                                      "Error moving link up:",
                                      error
                                    );
                                    toast.error("Failed to move link");
                                  }
                                }}
                                disabled={
                                  unifiedItems.findIndex(
                                    (u) =>
                                      u.type === "link" && u.item.id === link.id
                                  ) === 0
                                }
                                className="p-1.5 hover:bg-white rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Move up"
                              >
                                <ChevronUp className="w-4 h-4 text-[#676b5f]" />
                              </button>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await onMoveUnified(
                                      link.id,
                                      "link",
                                      "down"
                                    );
                                  } catch (error) {
                                    console.error(
                                      "Error moving link down:",
                                      error
                                    );
                                    toast.error("Failed to move link");
                                  }
                                }}
                                disabled={
                                  unifiedItems.findIndex(
                                    (u) =>
                                      u.type === "link" && u.item.id === link.id
                                  ) ===
                                  unifiedItems.length - 1
                                }
                                className="p-1.5 hover:bg-white rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Move down"
                              >
                                <ChevronDown className="w-4 h-4 text-[#676b5f]" />
                              </button>
                            </div>
                          )}

                          <Switch
                            checked={link.isActive}
                            onCheckedChange={() => {
                              onToggleLink(link.id);
                            }}
                          />

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              setLinkToDelete(link);
                              setDeleteConfirmOpen(true);
                            }}
                            className="hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  const block = unifiedItem.item;
                  return (
                    <div
                      key={`block-${block.id}`}
                      className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-4 border-2 border-gray-200/60 shadow-sm hover:shadow-xl hover:border-purple-300 hover:-translate-y-0.5 transition-all duration-300 group backdrop-blur-sm"
                      draggable
                      onDragStart={(e) => {
                        setDraggedItem({ id: block.id, type: "block" });
                        e.currentTarget.classList.add("opacity-50");
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.classList.remove("opacity-50");
                        setDraggedItem(null);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        await handleUnifiedDrop(block.id, "block");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          className="cursor-grab hover:bg-gray-100 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <GripVertical className="w-5 h-5 text-[#9ca3af]" />
                        </button>

                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleEditBlock(block)}
                        >
                          {getBlockTypeDisplay(block)}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Move Up/Down Buttons - Unified ordering */}
                          {unifiedItems.length > 1 && (
                            <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await onMoveUnified(
                                      block.id,
                                      "block",
                                      "up"
                                    );
                                  } catch (error) {
                                    console.error(
                                      "Error moving block up:",
                                      error
                                    );
                                    toast.error("Failed to move block");
                                  }
                                }}
                                disabled={
                                  unifiedItems.findIndex(
                                    (u) =>
                                      u.type === "block" &&
                                      u.item.id === block.id
                                  ) === 0
                                }
                                className="p-1.5 hover:bg-white rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Move up"
                              >
                                <ChevronUp className="w-4 h-4 text-[#676b5f]" />
                              </button>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await onMoveUnified(
                                      block.id,
                                      "block",
                                      "down"
                                    );
                                  } catch (error) {
                                    console.error(
                                      "Error moving block down:",
                                      error
                                    );
                                    toast.error("Failed to move block");
                                  }
                                }}
                                disabled={
                                  unifiedItems.findIndex(
                                    (u) =>
                                      u.type === "block" &&
                                      u.item.id === block.id
                                  ) ===
                                  unifiedItems.length - 1
                                }
                                className="p-1.5 hover:bg-white rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Move down"
                              >
                                <ChevronDown className="w-4 h-4 text-[#676b5f]" />
                              </button>
                            </div>
                          )}

                          <Switch
                            checked={block.isVisible}
                            onCheckedChange={async () => {
                              try {
                                await onToggleBlock(block.id);
                              } catch (error) {
                                console.error("Error toggling block:", error);
                                toast.error(
                                  "Failed to toggle block visibility"
                                );
                              }
                            }}
                          />

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              setBlockToDelete(block);
                              setDeleteBlockConfirmOpen(true);
                            }}
                            className="hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </>
          )}
        </div>

        {/* Delete Link Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent
            className="max-w-md max-h-[90vh] overflow-y-auto"
            aria-describedby="delete-link-description"
          >
            <DialogHeader>
              <DialogTitle>Confirm Delete Link</DialogTitle>
            </DialogHeader>
            <p id="delete-link-description" className="sr-only">
              Are you sure you want to delete this link?
            </p>

            <div className="space-y-4 mt-6">
              <p className="text-sm text-[#676b5f]">
                Are you sure you want to delete the link "{linkToDelete?.title}
                "?
              </p>

              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    if (linkToDelete) {
                      const typeName =
                        linkToDelete.type === "social"
                          ? "Social link"
                          : linkToDelete.type === "chat"
                          ? "Zalo chat"
                          : linkToDelete.type === "ecommerce"
                          ? "Product"
                          : linkToDelete.type === "donate"
                          ? "Donate button"
                          : linkToDelete.type === "contact"
                          ? "Contact form"
                          : "Link";
                      onDeleteLink(linkToDelete.id);
                      toast.success(
                        `${typeName} "${linkToDelete.title}" has been deleted!`
                      );
                    }
                    setDeleteConfirmOpen(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </Button>
                <Button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Block Confirmation Dialog */}
        <Dialog
          open={deleteBlockConfirmOpen}
          onOpenChange={setDeleteBlockConfirmOpen}
        >
          <DialogContent
            className="max-w-md max-h-[90vh] overflow-y-auto"
            aria-describedby="delete-block-description"
          >
            <DialogHeader>
              <DialogTitle>Confirm Delete Block</DialogTitle>
            </DialogHeader>
            <p id="delete-block-description" className="sr-only">
              Are you sure you want to delete this block?
            </p>

            <div className="space-y-4 mt-6">
              <p className="text-sm text-[#676b5f]">
                Are you sure you want to delete the block "
                {blockToDelete?.title}"?
              </p>

              <div className="flex items-center gap-4">
                <Button
                  onClick={async () => {
                    if (blockToDelete) {
                      try {
                        const typeName =
                          blockToDelete.type === "ecommerce"
                            ? "Product"
                            : blockToDelete.type === "donate"
                            ? "Donate button"
                            : blockToDelete.type === "contact"
                            ? "Contact form"
                            : blockToDelete.type === "chat"
                            ? "Zalo chat"
                            : "Block";
                        await onDeleteBlock(blockToDelete.id);
                        toast.success(
                          `${typeName} "${blockToDelete.title}" has been deleted!`
                        );
                      } catch (error) {
                        toast.error("Failed to delete. Please try again.");
                      }
                    }
                    setDeleteBlockConfirmOpen(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </Button>
                <Button
                  onClick={() => setDeleteBlockConfirmOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
