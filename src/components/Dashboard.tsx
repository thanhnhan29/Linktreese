import { useState, useEffect, useRef } from 'react';
import { User, Plus, Check, LogOut, ArrowRightLeft, Copy, CheckCheck, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import LinkEditor from './LinkEditor';
import PhonePreview from './PhonePreview';
import Analytics from './Analytics';
import Settings from './Settings';
import Appearance from './Appearance';
import Blocks from './Blocks';
import type { Block } from './Blocks';

interface BioPage {
  username: string;
  profileImage: string;
  bio: string;
  displayName: string;
}

interface Link {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  type?: string;
  platform?: string;
  data?: any;
}

interface DashboardProps {
  userEmail: string;
  currentBioPageUsername: string;
  onSwitchBioPage: (username: string) => void;
  onCreateNewBioPage: () => void;
  onLogout: () => void;
}

export default function Dashboard({ 
  userEmail, 
  currentBioPageUsername, 
  onSwitchBioPage,
  onCreateNewBioPage,
  onLogout 
}: DashboardProps) {
  const [bioPages, setBioPages] = useState<BioPage[]>([]);
  const [currentBioPage, setCurrentBioPage] = useState<BioPage | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [currentTab, setCurrentTab] = useState<'links' | 'analytics' | 'settings' | 'appearance'>('links');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [appearanceConfig, setAppearanceConfig] = useState<any>(null);
  const [hideVielinkLogo, setHideVielinkLogo] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // Helper function to copy text with fallback
  const copyToClipboard = async (text: string) => {
    try {
      // Try modern Clipboard API first
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      // Fallback for when Clipboard API is blocked
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        textArea.remove();
        
        if (successful) {
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2000);
        }
      } catch (fallbackErr) {
        console.error('Failed to copy text:', fallbackErr);
      }
    }
  };

  // Load bio pages and current bio page data
  useEffect(() => {
    // Load all bio pages for this user
    const savedBioPages = localStorage.getItem(`bioPages_${userEmail}`);
    if (savedBioPages) {
      const pages: BioPage[] = JSON.parse(savedBioPages);
      setBioPages(pages);
      
      // Find current bio page
      const current = pages.find(p => p.username === currentBioPageUsername);
      if (current) {
        setCurrentBioPage(current);
      }
    }

    // Load links for current bio page
    const savedLinks = localStorage.getItem(`links_${currentBioPageUsername}`);
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    } else {
      setLinks([]);
    }

    // Load blocks for current bio page
    const savedBlocks = localStorage.getItem(`blocks_${currentBioPageUsername}`);
    if (savedBlocks) {
      setBlocks(JSON.parse(savedBlocks));
    } else {
      setBlocks([]);
    }

    // Load appearance config for current bio page
    const savedAppearanceConfig = localStorage.getItem(`appearance_${currentBioPageUsername}`);
    if (savedAppearanceConfig) {
      setAppearanceConfig(JSON.parse(savedAppearanceConfig));
    } else {
      setAppearanceConfig(null);
    }

    // Load settings to get hideVielinkLogo
    const savedSettings = localStorage.getItem(`settings_${currentBioPageUsername}`);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setHideVielinkLogo(settings.hideVielinkLogo ?? false);
    } else {
      setHideVielinkLogo(false);
    }
  }, [userEmail, currentBioPageUsername]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false)
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for localStorage changes to update blocks in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const savedBlocks = localStorage.getItem(`blocks_${currentBioPageUsername}`);
      if (savedBlocks) {
        setBlocks(JSON.parse(savedBlocks));
      } else {
        setBlocks([]);
      }
    };

    // Poll localStorage every 500ms for changes
    const interval = setInterval(handleStorageChange, 500);
    
    return () => clearInterval(interval);
  }, [currentBioPageUsername]);

  const saveLinks = (newLinks: Link[]) => {
    setLinks(newLinks);
    localStorage.setItem(`links_${currentBioPageUsername}`, JSON.stringify(newLinks));
  };

  const saveBlocks = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    localStorage.setItem(`blocks_${currentBioPageUsername}`, JSON.stringify(newBlocks));
  };

  const saveProfile = (newProfileImage: string, newBio: string) => {
    if (!currentBioPage) return;

    // Update current bio page
    const updatedBioPage = {
      ...currentBioPage,
      profileImage: newProfileImage,
      bio: newBio
    };
    setCurrentBioPage(updatedBioPage);

    // Update in bio pages array
    const updatedBioPages = bioPages.map(page =>
      page.username === currentBioPageUsername ? updatedBioPage : page
    );
    setBioPages(updatedBioPages);
    localStorage.setItem(`bioPages_${userEmail}`, JSON.stringify(updatedBioPages));
  };

  const updateDisplayName = (newDisplayName: string) => {
    if (!currentBioPage) return;

    // Update current bio page
    const updatedBioPage = {
      ...currentBioPage,
      displayName: newDisplayName
    };
    setCurrentBioPage(updatedBioPage);

    // Update in bio pages array
    const updatedBioPages = bioPages.map(page =>
      page.username === currentBioPageUsername ? updatedBioPage : page
    );
    setBioPages(updatedBioPages);
    localStorage.setItem(`bioPages_${userEmail}`, JSON.stringify(updatedBioPages));
  };

  const addLink = (title: string, url: string, type?: string, platform?: string, data?: any) => {
    const newLink: Link = {
      id: Date.now().toString(),
      title,
      url,
      isActive: true,
      type: type as any,
      platform: platform || undefined,
      data: data || undefined
    };
    saveLinks([...links, newLink]);
  };

  const updateLink = (id: string, title: string, url: string, type?: string, platform?: string, data?: any) => {
    const updatedLinks = links.map(link =>
      link.id === id ? { ...link, title, url, type: type as any, platform: platform || undefined, data: data || undefined } : link
    );
    saveLinks(updatedLinks);
  };

  const deleteLink = (id: string) => {
    saveLinks(links.filter(link => link.id !== id));
  };

  const toggleLink = (id: string) => {
    const updatedLinks = links.map(link =>
      link.id === id ? { ...link, isActive: !link.isActive } : link
    );
    saveLinks(updatedLinks);
  };

  const moveLink = (id: string, direction: 'up' | 'down') => {
    const index = links.findIndex(link => link.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= links.length) return;

    const newLinks = [...links];
    [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
    saveLinks(newLinks);
  };

  const handleSwitchBioPage = (username: string) => {
    setShowAccountMenu(false);
    onSwitchBioPage(username);
  };

  const handleCreateNewBioPage = () => {
    setShowAccountMenu(false);
    onCreateNewBioPage();
  };

  // Download QR Code as PNG
  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;

    // Find the SVG element
    const svgElement = qrCodeRef.current.querySelector('svg');
    if (!svgElement) return;

    // Create a canvas to convert SVG to PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get SVG dimensions
    const svgSize = 200;
    const padding = 48; // 6 * 8px (p-6 in Tailwind)
    const totalSize = svgSize + padding * 2;

    // Set canvas size
    canvas.width = totalSize;
    canvas.height = totalSize;

    // Fill white background (matching the card background)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalSize, totalSize);

    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    // Load and draw the SVG on canvas
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, padding, padding, svgSize, svgSize);
      
      // Convert canvas to PNG and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `vielink-${currentBioPageUsername}-qr.png`;
        link.href = pngUrl;
        link.click();
        
        // Cleanup
        URL.revokeObjectURL(pngUrl);
      }, 'image/png');
      
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  if (!currentBioPage) {
    return <div className="min-h-screen bg-[#f6f7f5] flex items-center justify-center">
      <p className="text-[#676b5f]">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#f6f7f5]">
      {/* Header */}
      <header className="bg-white border-b border-[#e0e2d9]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo - No dropdown */}
            <h2 className="text-black">Linktree</h2>

            <nav className="flex gap-6">
              <button 
                onClick={() => setCurrentTab('links')}
                className={currentTab === 'links' ? 'text-black' : 'text-[#676b5f] hover:text-[#8129d9]'}
              >
                Links
              </button>
              <button 
                onClick={() => setCurrentTab('appearance')}
                className={currentTab === 'appearance' ? 'text-black' : 'text-[#676b5f] hover:text-[#8129d9]'}
              >
                Appearance
              </button>
              <button 
                onClick={() => setCurrentTab('analytics')}
                className={currentTab === 'analytics' ? 'text-black' : 'text-[#676b5f] hover:text-[#8129d9]'}
              >
                Analytics
              </button>
              <button 
                onClick={() => setCurrentTab('settings')}
                className={currentTab === 'settings' ? 'text-black' : 'text-[#676b5f] hover:text-[#8129d9]'}
              >
                Settings
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#676b5f] text-sm">@{currentBioPageUsername}</span>
            </div>
            <button className="bg-white border border-[#e0e2d9] text-black px-4 py-2 rounded-full hover:bg-[#f6f7f5]" onClick={() => setShowShareDialog(true)}>
              Share
            </button>
            
            {/* Account Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="w-10 h-10 bg-[#e0e2d9] rounded-full flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-[#8129d9] transition-all"
              >
                {currentBioPage.profileImage ? (
                  <img src={currentBioPage.profileImage} alt={currentBioPageUsername} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-[#676b5f]" />
                )}
              </button>

              {/* Account Dropdown Menu */}
              {showAccountMenu && (
                <div className="absolute top-full right-0 mt-2 w-[300px] bg-white border border-[#e0e2d9] rounded-lg shadow-lg py-2 z-50">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-[#e0e2d9]">
                    <p className="text-black">{userEmail}</p>
                    <p className="text-xs text-[#676b5f] mt-1">Account</p>
                  </div>

                  {/* Account Actions */}
                  <div className="py-2 border-b border-[#e0e2d9]">
                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-2 hover:bg-[#f6f7f5] flex items-center gap-3 text-black transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-[#676b5f]" />
                      <span className="text-sm">Logout</span>
                    </button>
                    <button
                      disabled
                      className="w-full px-4 py-2 hover:bg-[#f6f7f5] flex items-center gap-3 text-[#676b5f] transition-colors opacity-50 cursor-not-allowed"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      <span className="text-sm">Switch account (Coming soon)</span>
                    </button>
                  </div>

                  {/* Bio Pages Section */}
                  <div className="py-2">
                    <div className="px-4 py-2">
                      <p className="text-xs text-[#676b5f]">YOUR BIO PAGES</p>
                    </div>
                    
                    <div className="max-h-[250px] overflow-y-auto">
                      {bioPages.map((page) => (
                        <button
                          key={page.username}
                          onClick={() => handleSwitchBioPage(page.username)}
                          className="w-full px-4 py-2.5 hover:bg-[#f6f7f5] flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#e0e2d9] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                              {page.profileImage ? (
                                <img src={page.profileImage} alt={page.username} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[#676b5f] text-sm">{page.username[0].toUpperCase()}</span>
                              )}
                            </div>
                            <div className="text-left">
                              <p className="text-black text-sm">@{page.username}</p>
                              {page.displayName && page.displayName !== page.username && (
                                <p className="text-[#676b5f] text-xs truncate max-w-[180px]">{page.displayName}</p>
                              )}
                            </div>
                          </div>
                          {page.username === currentBioPageUsername && (
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Create New Bio Page Button */}
                    <div className="border-t border-[#e0e2d9] mt-2 pt-2">
                      <button
                        onClick={handleCreateNewBioPage}
                        className="w-full px-4 py-2.5 hover:bg-[#f6f7f5] flex items-center gap-3 text-[#8129d9] transition-colors"
                      >
                        <div className="w-8 h-8 bg-[#8129d9]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Plus className="w-4 h-4 text-[#8129d9]" />
                        </div>
                        <span className="text-sm">Create new bio page</span>
                      </button>
                    </div>
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
          {/* Left Side - Content based on active tab */}
          <div>
            {currentTab === 'links' && (
              <LinkEditor
                links={links}
                user={{ username: currentBioPageUsername, email: userEmail }}
                profileImage={currentBioPage.profileImage}
                bio={currentBioPage.bio}
                onAddLink={addLink}
                onUpdateLink={updateLink}
                onDeleteLink={deleteLink}
                onToggleLink={toggleLink}
                onMoveLink={moveLink}
                onUpdateProfile={saveProfile}
              />
            )}
            {currentTab === 'appearance' && (
              <Appearance
                username={currentBioPageUsername}
                onConfigChange={(config) => {
                  setAppearanceConfig(config);
                  localStorage.setItem(`appearance_${currentBioPageUsername}`, JSON.stringify(config));
                }}
              />
            )}
            {currentTab === 'analytics' && (
              <Analytics username={currentBioPageUsername} links={links} />
            )}
            {currentTab === 'settings' && (
              <Settings 
                user={{ username: currentBioPageUsername, email: userEmail }} 
                onLogout={onLogout} 
                onUpdateDisplayName={updateDisplayName}
                onSettingsChange={(settings) => {
                  setHideVielinkLogo(settings.hideVielinkLogo ?? false);
                }}
              />
            )}
          </div>

          {/* Right Side - Preview */}
          <div className="sticky top-8 h-fit">
            <PhonePreview
              username={currentBioPageUsername}
              name={currentBioPage.displayName || currentBioPageUsername}
              bio={currentBioPage.bio}
              profileImage={currentBioPage.profileImage}
              links={links.filter(link => link.isActive)}
              blocks={blocks.filter(block => block.isActive)}
              appearanceConfig={appearanceConfig}
              hideVielinkLogo={hideVielinkLogo}
            />
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={(open) => {
        setShowShareDialog(open);
        if (!open) setCopiedLink(false);
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle className="text-center text-2xl">Share your Linktree</DialogTitle>
          <DialogDescription className="text-center">
            Scan the QR code or copy the link to share your bio page
          </DialogDescription>
          
          <div className="flex flex-col items-center gap-6 py-4">
            {/* QR Code */}
            <div className="bg-white p-6 rounded-2xl border-2 border-[#e0e2d9] shadow-sm" ref={qrCodeRef}>
              <QRCodeSVG 
                value={`https://vielink.vn/${currentBioPageUsername}`} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Link with Copy Button */}
            <div className="w-full">
              <div className="flex items-center gap-2 bg-[#f6f7f5] border border-[#e0e2d9] rounded-full px-4 py-3">
                <input
                  type="text"
                  readOnly
                  value={`https://vielink.vn/${currentBioPageUsername}`}
                  className="flex-1 bg-transparent text-black text-sm outline-none"
                />
                <button
                  onClick={() => copyToClipboard(`https://vielink.vn/${currentBioPageUsername}`)}
                  className="flex items-center gap-2 bg-[#8129d9] text-white px-4 py-2 rounded-full hover:bg-[#6c21c4] transition-all"
                >
                  {copiedLink ? (
                    <>
                      <CheckCheck className="w-4 h-4" />
                      <span className="text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Download QR Code Button */}
            <button
              onClick={downloadQRCode}
              className="flex items-center gap-2 bg-[#8129d9] text-white px-4 py-2 rounded-full hover:bg-[#6c21c4] transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Download QR Code</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}