// src/components/PublicBioView.tsx
// Responsive public bio page view (no phone frame)

import {
  Instagram,
  Send,
  Facebook,
  Twitter,
  Hash,
  MessageCircle,
  Phone,
  MessageSquare,
  Twitch,
  Youtube,
} from "lucide-react";
import type { Block } from "./Blocks";
import BlockPreview from "./BlockPreview";

interface Link {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  type?: string;
  platform?: string;
  data?: any;
}

interface AppearanceConfig {
  background: {
    type: "solid" | "gradient" | "image";
    solidColor: string;
    gradientStart: string;
    gradientEnd: string;
    gradientDirection: "to-b" | "to-t" | "to-r" | "to-l" | "to-br" | "to-bl";
    imageUrl: string;
  };
  buttons: {
    style: "rounded" | "square" | "pill";
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    hasShadow: boolean;
  };
  fonts: {
    heading: string;
    body: string;
  };
  textColors: {
    username: string;
    description: string;
  };
}

interface PublicBioViewProps {
  username: string;
  name: string;
  bio: string;
  profileImage: string;
  links: Link[];
  appearanceConfig?: AppearanceConfig | null;
  hideVielinkLogo?: boolean;
  blocks?: Block[];
  onLinkClick?: (linkId: string) => void;
  onBlockClick?: (blockId: string) => void;
}

export default function PublicBioView({
  username,
  name,
  bio,
  profileImage,
  links,
  appearanceConfig,
  hideVielinkLogo,
  blocks = [],
  onLinkClick,
  onBlockClick,
}: PublicBioViewProps) {
  const handleLinkClick = (link: Link) => {
    if (onLinkClick) {
      onLinkClick(link.id);
    }
  };

  const handleBlockClick = (blockId: string) => {
    if (onBlockClick) {
      onBlockClick(blockId);
    }
  };

  // Get background styles
  const getBackgroundStyle = () => {
    if (!appearanceConfig || !appearanceConfig.background) {
      return { backgroundColor: "#ffffff" };
    }

    const { background } = appearanceConfig;

    if (background.type === "solid") {
      return { backgroundColor: background.solidColor || "#ffffff" };
    } else if (background.type === "gradient") {
      const directionMap: Record<string, string> = {
        "to-b": "to bottom",
        "to-t": "to top",
        "to-r": "to right",
        "to-l": "to left",
        "to-br": "to bottom right",
        "to-bl": "to bottom left",
      };
      const direction =
        directionMap[background.gradientDirection] || "to bottom";
      return {
        background: `linear-gradient(${direction}, ${
          background.gradientStart || "#ffffff"
        }, ${background.gradientEnd || "#ffffff"})`,
      };
    } else if (background.type === "image" && background.imageUrl) {
      return {
        backgroundImage: `url(${background.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }

    return { backgroundColor: "#ffffff" };
  };

  // Get button styles
  const getButtonStyle = (_link?: Link) => {
    if (!appearanceConfig || !appearanceConfig.buttons) {
      return {
        backgroundColor: "white",
        border: "2px solid black",
        borderRadius: "50px",
        color: "black",
      };
    }

    const { buttons } = appearanceConfig;

    const borderRadius =
      buttons.style === "rounded"
        ? "8px"
        : buttons.style === "square"
        ? "0px"
        : "50px";

    return {
      backgroundColor: buttons.backgroundColor || "#ffffff",
      color: buttons.textColor || "#000000",
      border: `2px solid ${buttons.borderColor || "#000000"}`,
      borderRadius,
      boxShadow: buttons.hasShadow ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
    };
  };

  // Get font styles
  const getFontFamily = (type: "heading" | "body") => {
    if (!appearanceConfig || !appearanceConfig.fonts)
      return "Inter, sans-serif";
    return `${appearanceConfig.fonts[type]}, sans-serif`;
  };

  // Get social media icon
  const getSocialIcon = (platform: string | undefined) => {
    if (!platform) return null;

    const iconProps = { className: "w-5 h-5", strokeWidth: 2 };

    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram {...iconProps} />;
      case "tiktok":
        return <Send {...iconProps} />;
      case "facebook":
        return <Facebook {...iconProps} />;
      case "x":
      case "twitter":
        return <Twitter {...iconProps} />;
      case "pinterest":
        return <Hash {...iconProps} />;
      case "snapchat":
        return <MessageCircle {...iconProps} />;
      case "whatsapp":
        return <Phone {...iconProps} />;
      case "reddit":
        return <MessageSquare {...iconProps} />;
      case "twitch":
        return <Twitch {...iconProps} />;
      case "youtube":
        return <Youtube {...iconProps} />;
      default:
        return null;
    }
  };

  const renderBlock = (block: Block) => {
    const buttonStyle = getButtonStyle({} as Link);
    const fontFamily = getFontFamily("body");

    return (
      <BlockPreview
        key={block.id}
        block={block}
        buttonStyle={buttonStyle}
        fontFamily={fontFamily}
        onBlockClick={handleBlockClick}
      />
    );
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor:
          appearanceConfig?.background?.type !== "image"
            ? "#f6f7f5"
            : undefined,
      }}
    >
      {/* Content Container - Giống phone width */}
      <div
        className="max-w-[480px] mx-auto min-h-screen shadow-xl"
        style={getBackgroundStyle()}
      >
        <div className="flex flex-col items-center px-6 sm:px-8 py-8 sm:py-12">
          {/* Profile Image */}
          <div className="w-24 h-24 bg-[#e0e2d9] rounded-full mb-4 overflow-hidden flex items-center justify-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className="text-3xl text-[#676b5f]"
                style={{ fontFamily: getFontFamily("heading") }}
              >
                {name ? name[0]?.toUpperCase() : "?"}
              </span>
            )}
          </div>

          {/* Username */}
          <h2
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: getFontFamily("heading"),
              color: appearanceConfig?.textColors?.username || "#000000",
            }}
          >
            @{username}
          </h2>

          {/* Display Name */}
          {name !== username && (
            <p
              className="text-lg mb-2"
              style={{
                fontFamily: getFontFamily("body"),
                color: appearanceConfig?.textColors?.username || "#000000",
              }}
            >
              {name}
            </p>
          )}

          {/* Bio */}
          {bio && (
            <p
              className="text-center mb-8 w-full break-words whitespace-pre-wrap overflow-hidden text-base"
              style={{
                fontFamily: getFontFamily("body"),
                color: appearanceConfig?.textColors?.description || "#676b5f",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {bio}
            </p>
          )}

          {/* Links */}
          <div className="w-full space-y-3">
            {links.length === 0 && blocks.length === 0 ? (
              <div className="text-center py-12">
                <p
                  className="text-base text-[#676b5f]"
                  style={{ fontFamily: getFontFamily("body") }}
                >
                  No links yet
                </p>
              </div>
            ) : (
              links.map((link) => {
                // Check if this is a special block type
                if (
                  link.type === "ecommerce" ||
                  link.type === "donate" ||
                  link.type === "contact" ||
                  link.type === "chat"
                ) {
                  const blockData: Block = {
                    id: link.id,
                    type: link.type as any,
                    data: link.data,
                    isActive: link.isActive,
                    order: 0,
                  };

                  const buttonStyle = getButtonStyle(link);
                  const fontFamily = getFontFamily("body");

                  return (
                    <BlockPreview
                      key={link.id}
                      block={blockData}
                      buttonStyle={buttonStyle}
                      fontFamily={fontFamily}
                      onBlockClick={handleBlockClick}
                    />
                  );
                }

                // Regular social/link rendering
                const socialIcon = getSocialIcon(link.platform);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(link)}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 text-base transition-all duration-200 hover:opacity-80 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      ...getButtonStyle(link),
                      fontFamily: getFontFamily("body"),
                    }}
                  >
                    {socialIcon}
                    <span className="truncate">{link.title}</span>
                  </a>
                );
              })
            )}
          </div>

          {/* Blocks */}
          {blocks.length > 0 && (
            <div className="w-full space-y-3 mt-3">
              {blocks.map(renderBlock)}
            </div>
          )}

          {/* VieLink Footer - Hidden for PRO users */}
          {!hideVielinkLogo && (
            <div className="mt-12 pt-8">
              <a
                href="/login"
                className="text-center text-sm opacity-70 hover:opacity-100 transition-opacity block"
                style={{
                  fontFamily: getFontFamily("body"),
                  color: appearanceConfig?.textColors?.description || "#676b5f",
                }}
              >
                Create your own link-in-bio with{" "}
                <span className="font-semibold">VieLink</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
