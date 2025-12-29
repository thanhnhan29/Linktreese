import { Instagram, Send, Facebook, Twitter, Hash, MessageCircle, Phone, MessageSquare, Twitch, Youtube } from 'lucide-react';
import type { Block } from './Blocks';
import BlockPreview from './BlockPreview';

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
    type: 'solid' | 'gradient' | 'image';
    solidColor: string;
    gradientStart: string;
    gradientEnd: string;
    gradientDirection: 'to-b' | 'to-t' | 'to-r' | 'to-l' | 'to-br' | 'to-bl';
    imageUrl: string;
  };
  buttons: {
    style: 'rounded' | 'square' | 'pill';
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

interface PhonePreviewProps {
  username: string;
  name: string;
  bio: string;
  profileImage: string;
  links: Link[];
  appearanceConfig?: AppearanceConfig | null;
  hideVielinkLogo?: boolean;
  blocks?: Block[];
}

const trackLinkClick = (username: string, linkId: string, linkTitle: string) => {
  const clickData = {
    linkId,
    linkTitle,
    timestamp: Date.now()
  };
  
  const savedClicks = localStorage.getItem(`analytics_${username}`);
  const clicks = savedClicks ? JSON.parse(savedClicks) : [];
  clicks.push(clickData);
  localStorage.setItem(`analytics_${username}`, JSON.stringify(clicks));
};

export default function PhonePreview({ username, name, bio, profileImage, links, appearanceConfig, hideVielinkLogo, blocks = [] }: PhonePreviewProps) {
  const handleLinkClick = (link: Link) => {
    trackLinkClick(username, link.id, link.title);
  };

  // Get background styles
  const getBackgroundStyle = () => {
    if (!appearanceConfig) return { backgroundColor: '#ffffff' };

    const { background } = appearanceConfig;
    
    if (background.type === 'solid') {
      return { backgroundColor: background.solidColor };
    } else if (background.type === 'gradient') {
      // Convert Tailwind direction to CSS gradient direction
      const directionMap: Record<string, string> = {
        'to-b': 'to bottom',
        'to-t': 'to top',
        'to-r': 'to right',
        'to-l': 'to left',
        'to-br': 'to bottom right',
        'to-bl': 'to bottom left'
      };
      const direction = directionMap[background.gradientDirection] || 'to bottom';
      return {
        background: `linear-gradient(${direction}, ${background.gradientStart}, ${background.gradientEnd})`
      };
    } else if (background.type === 'image' && background.imageUrl) {
      return {
        backgroundImage: `url(${background.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    
    return { backgroundColor: '#ffffff' };
  };

  // Get button styles
  const getButtonStyle = (link: Link) => {
    if (!appearanceConfig) {
      return {
        backgroundColor: 'white',
        border: '2px solid black',
        borderRadius: '50px',
        color: 'black'
      };
    }

    const { buttons } = appearanceConfig;
    
    const borderRadius = buttons.style === 'rounded' ? '8px' : buttons.style === 'square' ? '0px' : '50px';
    
    return {
      backgroundColor: buttons.backgroundColor,
      color: buttons.textColor,
      border: `2px solid ${buttons.borderColor}`,
      borderRadius,
      boxShadow: buttons.hasShadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
    };
  };

  // Get font styles
  const getFontFamily = (type: 'heading' | 'body') => {
    if (!appearanceConfig) return 'Inter, sans-serif';
    return `${appearanceConfig.fonts[type]}, sans-serif`;
  };

  // Get social media icon
  const getSocialIcon = (platform: string | undefined) => {
    if (!platform) return null;
    
    const iconProps = { className: "w-5 h-5", strokeWidth: 2 };
    
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'tiktok':
        return <Send {...iconProps} />;
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'x':
      case 'twitter':
        return <Twitter {...iconProps} />;
      case 'pinterest':
        return <Hash {...iconProps} />;
      case 'snapchat':
        return <MessageCircle {...iconProps} />;
      case 'whatsapp':
        return <Phone {...iconProps} />;
      case 'reddit':
        return <MessageSquare {...iconProps} />;
      case 'twitch':
        return <Twitch {...iconProps} />;
      case 'youtube':
        return <Youtube {...iconProps} />;
      default:
        return null;
    }
  };

  const renderBlock = (block: Block) => {
    const buttonStyle = getButtonStyle({} as Link);
    const fontFamily = getFontFamily('body');

    return (
      <BlockPreview
        key={block.id}
        block={block}
        buttonStyle={buttonStyle}
        fontFamily={fontFamily}
      />
    );
  };

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 text-[#676b5f]">Live Preview</p>
      
      {/* Phone Frame */}
      <div className="relative bg-black rounded-[40px] p-3 shadow-2xl">
        <div 
          className="rounded-[32px] w-[340px] h-[680px] overflow-hidden"
          style={getBackgroundStyle()}
        >
          {/* Phone Screen Content */}
          <div className="h-full overflow-y-auto p-8">
            <div className="flex flex-col items-center">
              {/* Profile Image */}
              <div className="w-24 h-24 bg-[#e0e2d9] rounded-full mb-4 overflow-hidden flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#676b5f]" style={{ fontFamily: getFontFamily('heading') }}>
                    {name[0]?.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Username */}
              <h2 
                className="mb-2"
                style={{ 
                  fontFamily: getFontFamily('heading'),
                  color: appearanceConfig?.textColors?.username || '#000000'
                }}
              >
                @{username}
              </h2>

              {/* Display Name */}
              {name !== username && (
                <p 
                  className="mb-2"
                  style={{ 
                    fontFamily: getFontFamily('body'),
                    color: appearanceConfig?.textColors?.username || '#000000'
                  }}
                >
                  {name}
                </p>
              )}

              {/* Bio */}
              {bio && (
                <p 
                  className="text-center mb-6"
                  style={{ 
                    fontFamily: getFontFamily('body'),
                    color: appearanceConfig?.textColors?.description || '#676b5f'
                  }}
                >
                  {bio}
                </p>
              )}

              {/* Links */}
              <div className="w-full space-y-3">
                {links.length === 0 && blocks.length === 0 ? (
                  <div className="text-center py-8">
                    <p 
                      className="text-[#676b5f]"
                      style={{ fontFamily: getFontFamily('body') }}
                    >
                      Your links will appear here
                    </p>
                  </div>
                ) : (
                  links.map((link) => {
                    // Check if this is a special block type
                    if (link.type === 'ecommerce' || link.type === 'donate' || link.type === 'contact' || link.type === 'chat') {
                      const blockData: Block = {
                        id: link.id,
                        type: link.type as any,
                        data: link.data,
                        isActive: link.isActive,
                        order: 0
                      };
                      
                      const buttonStyle = getButtonStyle(link);
                      const fontFamily = getFontFamily('body');
                      
                      return (
                        <BlockPreview
                          key={link.id}
                          block={blockData}
                          buttonStyle={buttonStyle}
                          fontFamily={fontFamily}
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
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 transition-opacity hover:opacity-80"
                        style={{
                          ...getButtonStyle(link),
                          fontFamily: getFontFamily('body')
                        }}
                      >
                        {socialIcon}
                        <span>{link.title}</span>
                      </a>
                    );
                  })
                )}
              </div>

              {/* Blocks */}
              {blocks.length > 0 && (
                <div className="w-full space-y-3 mt-4">
                  {blocks.map(renderBlock)}
                </div>
              )}

              {/* VieLink Footer - Hidden for PRO users */}
              {!hideVielinkLogo && (
                <div className="mt-8 pt-6 border-t border-white/20">
                  <p 
                    className="text-center text-xs opacity-60"
                    style={{ 
                      fontFamily: getFontFamily('body'),
                      color: appearanceConfig?.textColors?.description || '#676b5f'
                    }}
                  >
                    Powered by <span className="font-medium">VieLink</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phone Notch */}
      </div>
    </div>
  );
}