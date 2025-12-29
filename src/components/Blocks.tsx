import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, GripVertical, ShoppingBag, Heart, Mail, MessageCircle, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

export interface Block {
  id: string;
  type: 'ecommerce' | 'donate' | 'contact' | 'chat';
  data: any;
  isActive: boolean;
  order: number;
}

interface EcommerceProduct {
  title: string;
  image: string;
  price: string;
  url: string;
  platform: 'shopee' | 'lazada';
}

interface DonateData {
  title: string;
  method: 'momo' | 'zalopay' | 'vietqr';
  qrImage?: string;
  paymentLink?: string;
}

interface ContactData {
  title: string;
  receiverEmail: string;
}

interface BlocksProps {
  username: string;
}

export default function Blocks({ username }: BlocksProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState<Block['type'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<Block | null>(null);

  // E-commerce form states
  const [ecommerceUrl, setEcommerceUrl] = useState('');

  // Donate form states
  const [donateTitle, setDonateTitle] = useState('');
  const [donateMethod, setDonateMethod] = useState<'momo' | 'zalopay' | 'vietqr'>('vietqr');
  const [donateQRImage, setDonateQRImage] = useState('');
  const [donatePaymentLink, setDonatePaymentLink] = useState('');
  const [qrImageFile, setQrImageFile] = useState<File | null>(null);
  const [qrImagePreview, setQrImagePreview] = useState('');

  // Contact form states
  const [contactTitle, setContactTitle] = useState('Contact Me');
  const [contactEmail, setContactEmail] = useState('');

  // Chat form states
  const [chatTitle, setChatTitle] = useState('Chat on Zalo');
  const [chatPhoneNumber, setChatPhoneNumber] = useState('');
  const [chatMessage, setChatMessage] = useState('Hello! I need help.');

  useEffect(() => {
    // Load blocks from localStorage
    const savedBlocks = localStorage.getItem(`blocks_${username}`);
    if (savedBlocks) {
      setBlocks(JSON.parse(savedBlocks));
    }
  }, [username]);

  // Clear payment fields when switching payment methods
  useEffect(() => {
    if (donateMethod === 'vietqr') {
      setDonatePaymentLink('');
    } else {
      setDonateQRImage('');
      setQrImagePreview('');
      setQrImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [donateMethod]);

  const saveBlocks = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    localStorage.setItem(`blocks_${username}`, JSON.stringify(newBlocks));
  };

  const blockTypes = [
    {
      type: 'ecommerce' as const,
      title: 'Product Showcase',
      description: 'Add products from Shopee or Lazada',
      icon: ShoppingBag,
      color: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    },
    {
      type: 'donate' as const,
      title: 'Support & Tips',
      description: 'Accept donations via Momo, ZaloPay, or VietQR',
      icon: Heart,
      color: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
    },
    {
      type: 'contact' as const,
      title: 'Contact Form',
      description: 'Let visitors send you messages',
      icon: Mail,
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    },
    {
      type: 'chat' as const,
      title: 'Quick Chat',
      description: 'Connect via Zalo messaging',
      icon: MessageCircle,
      color: 'bg-green-50 text-green-600 hover:bg-green-100',
    },
  ];

  const validateEcommerceUrl = (url: string): { valid: boolean; platform?: 'shopee' | 'lazada' } => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      if (hostname.includes('shopee')) {
        return { valid: true, platform: 'shopee' };
      } else if (hostname.includes('lazada')) {
        return { valid: true, platform: 'lazada' };
      }
      
      return { valid: false };
    } catch {
      return { valid: false };
    }
  };

  const mockFetchProductData = async (url: string, platform: 'shopee' | 'lazada'): Promise<EcommerceProduct> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock product data based on platform
    if (platform === 'shopee') {
      return {
        title: 'Premium Wireless Headphones - High Quality Sound',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        price: '₫599,000',
        url: url,
        platform: 'shopee',
      };
    } else {
      return {
        title: 'Smart Watch - Fitness Tracker & Health Monitor',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        price: '₫1,299,000',
        url: url,
        platform: 'lazada',
      };
    }
  };

  const handleSelectBlockType = (type: Block['type']) => {
    setSelectedBlockType(type);
    setShowAddDialog(false);
    setShowBlockForm(true);
    setEditingBlock(null); // Clear editing mode
    
    // Reset form fields
    setEcommerceUrl('');
    setDonateTitle('');
    setDonateMethod('vietqr');
    setDonateQRImage('');
    setDonatePaymentLink('');
    setQrImageFile(null);
    setQrImagePreview('');
    setContactTitle('Contact Me');
    setContactEmail('');
    setChatTitle('Chat on Zalo');
    setChatPhoneNumber('');
    setChatMessage('Hello! I need help.');
  };

  const handleEditBlock = (block: Block) => {
    setEditingBlock(block);
    setSelectedBlockType(block.type);
    setShowBlockForm(true);
    
    // Load block data into form fields
    switch (block.type) {
      case 'ecommerce':
        setEcommerceUrl(block.data.url || '');
        break;
      
      case 'donate':
        setDonateTitle(block.data.title || '');
        setDonateMethod(block.data.method || 'vietqr');
        if (block.data.method === 'vietqr' && block.data.qrImage) {
          setDonateQRImage(block.data.qrImage);
          setQrImagePreview(block.data.qrImage);
        } else {
          setDonatePaymentLink(block.data.paymentLink || '');
        }
        break;
      
      case 'contact':
        setContactTitle(block.data.title || 'Contact Me');
        setContactEmail(block.data.receiverEmail || '');
        break;
      
      case 'chat':
        setChatTitle(block.data.title || 'Chat on Zalo');
        setChatPhoneNumber(block.data.phoneNumber || '');
        setChatMessage(block.data.message || 'Hello! I need help.');
        break;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file format. Please upload PNG, JPG, or JPEG images only.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large. Please upload an image smaller than 5MB.');
      return;
    }

    setQrImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setQrImagePreview(result);
      setDonateQRImage(result); // Store base64 for saving
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setQrImageFile(null);
    setQrImagePreview('');
    setDonateQRImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddEcommerceBlock = async () => {
    const validation = validateEcommerceUrl(ecommerceUrl);
    
    if (!validation.valid) {
      toast.error('Unsupported URL. Please use links from Shopee or Lazada.');
      return;
    }

    setIsLoading(true);
    
    try {
      const productData = await mockFetchProductData(ecommerceUrl, validation.platform!);
      
      if (editingBlock) {
        // Update existing block
        const updatedBlocks = blocks.map(block =>
          block.id === editingBlock.id
            ? { ...block, data: productData }
            : block
        );
        saveBlocks(updatedBlocks);
        toast.success('Product updated successfully!');
      } else {
        // Add new block
        const newBlock: Block = {
          id: Date.now().toString(),
          type: 'ecommerce',
          data: productData,
          isActive: true,
          order: blocks.length,
        };
        saveBlocks([...blocks, newBlock]);
        toast.success('Product added successfully!');
      }
      
      setShowBlockForm(false);
      setEditingBlock(null);
      setEcommerceUrl('');
    } catch (error) {
      toast.error('Failed to fetch product data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDonateBlock = () => {
    // Validate required fields
    if (!donateTitle.trim()) {
      toast.error('Button title is required.');
      return;
    }

    // Validate based on payment method
    if (donateMethod === 'vietqr') {
      if (!donateQRImage) {
        toast.error('Please upload a QR code image.');
        return;
      }
    } else {
      // Momo or ZaloPay
      if (!donatePaymentLink.trim()) {
        toast.error('Please enter a payment link.');
        return;
      }
    }

    const donateData: DonateData = {
      title: donateTitle,
      method: donateMethod,
    };

    if (donateMethod === 'vietqr') {
      donateData.qrImage = donateQRImage;
    } else {
      donateData.paymentLink = donatePaymentLink;
    }

    if (editingBlock) {
      // Update existing block
      const updatedBlocks = blocks.map(block =>
        block.id === editingBlock.id
          ? { ...block, data: donateData }
          : block
      );
      saveBlocks(updatedBlocks);
      toast.success('Donation block updated successfully!');
    } else {
      // Add new block
      const newBlock: Block = {
        id: Date.now().toString(),
        type: 'donate',
        data: donateData,
        isActive: true,
        order: blocks.length,
      };
      saveBlocks([...blocks, newBlock]);
      toast.success('Donation block added successfully!');
    }
    
    setShowBlockForm(false);
    setEditingBlock(null);
  };

  const handleAddContactBlock = () => {
    // Validate required fields
    if (!contactTitle.trim()) {
      toast.error('Form title is required.');
      return;
    }

    if (!contactEmail.trim()) {
      toast.error('Your email address is required.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const contactData: ContactData = {
      title: contactTitle,
      receiverEmail: contactEmail,
    };

    if (editingBlock) {
      // Update existing block
      const updatedBlocks = blocks.map(block =>
        block.id === editingBlock.id
          ? { ...block, data: contactData }
          : block
      );
      saveBlocks(updatedBlocks);
      toast.success('Contact form updated successfully!');
    } else {
      // Add new block
      const newBlock: Block = {
        id: Date.now().toString(),
        type: 'contact',
        data: contactData,
        isActive: true,
        order: blocks.length,
      };
      saveBlocks([...blocks, newBlock]);
      toast.success('Contact form added successfully!');
    }
    
    setShowBlockForm(false);
    setEditingBlock(null);
  };

  const handleAddChatBlock = () => {
    // Validate required fields
    if (!chatPhoneNumber.trim()) {
      toast.error('Please enter your Zalo phone number.');
      return;
    }

    // Validate phone number format (Vietnamese phone: 10 digits starting with 0)
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(chatPhoneNumber.trim())) {
      toast.error('Invalid phone number. Please enter 10 digits starting with 0.');
      return;
    }

    // Use custom title or default
    const finalTitle = chatTitle.trim() || 'Chat on Zalo';

    const chatData = {
      title: finalTitle,
      phoneNumber: chatPhoneNumber,
      message: chatMessage,
    };

    if (editingBlock) {
      // Update existing block
      const updatedBlocks = blocks.map(block =>
        block.id === editingBlock.id
          ? { ...block, data: chatData }
          : block
      );
      saveBlocks(updatedBlocks);
      toast.success('Quick chat updated successfully!');
    } else {
      // Add new block
      const newBlock: Block = {
        id: Date.now().toString(),
        type: 'chat',
        data: chatData,
        isActive: true,
        order: blocks.length,
      };
      saveBlocks([...blocks, newBlock]);
      toast.success('Quick chat added successfully!');
    }
    
    setShowBlockForm(false);
    setEditingBlock(null);
  };

  const handleAddBlock = () => {
    if (!selectedBlockType) return;

    switch (selectedBlockType) {
      case 'ecommerce':
        handleAddEcommerceBlock();
        break;
      case 'donate':
        handleAddDonateBlock();
        break;
      case 'contact':
        handleAddContactBlock();
        break;
      case 'chat':
        handleAddChatBlock();
        break;
    }
  };

  const deleteBlock = (id: string) => {
    saveBlocks(blocks.filter(block => block.id !== id));
    toast.success('Block removed successfully!');
  };

  const toggleBlock = (id: string) => {
    const updatedBlocks = blocks.map(block =>
      block.id === id ? { ...block, isActive: !block.isActive } : block
    );
    saveBlocks(updatedBlocks);
  };

  const getBlockIcon = (type: Block['type']) => {
    const blockType = blockTypes.find(bt => bt.type === type);
    return blockType?.icon || ShoppingBag;
  };

  const renderBlockPreview = (block: Block) => {
    switch (block.type) {
      case 'ecommerce':
        return (
          <div className="flex items-center gap-3">
            <img 
              src={block.data.image} 
              alt={block.data.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-black truncate">{block.data.title}</p>
              <p className="text-sm text-[#676b5f]">{block.data.price} • {block.data.platform}</p>
            </div>
          </div>
        );
      
      case 'donate':
        return (
          <div>
            <p className="text-black">{block.data.title}</p>
            <p className="text-sm text-[#676b5f]">
              {block.data.method === 'vietqr' ? 'VietQR' : block.data.method === 'momo' ? 'Momo' : 'ZaloPay'} payment
            </p>
          </div>
        );
      
      case 'contact':
        return (
          <div>
            <p className="text-black">{block.data.title}</p>
            <p className="text-sm text-[#676b5f]">Sends to: {block.data.receiverEmail}</p>
          </div>
        );
      
      case 'chat':
        return (
          <div>
            <p className="text-black">{block.data.title || 'Chat on Zalo'}</p>
            <p className="text-sm text-[#676b5f]">{block.data.phoneNumber}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-black text-xl">Content Blocks</h2>
          <p className="text-[#676b5f] text-sm mt-1">
            Add interactive blocks to engage your audience
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-[#8129d9] hover:bg-[#6920b0] text-white rounded-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Block
        </Button>
      </div>

      {/* Blocks List */}
      {blocks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#e0e2d9]">
          <div className="w-16 h-16 bg-[#f6f7f5] rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-[#676b5f]" />
          </div>
          <h3 className="text-black text-lg mb-2">No blocks yet</h3>
          <p className="text-[#676b5f] mb-6">
            Start adding interactive blocks to showcase products, accept donations, and more.
          </p>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-[#8129d9] hover:bg-[#6920b0] text-white rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Block
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block) => {
            const Icon = getBlockIcon(block.type);
            return (
              <div
                key={block.id}
                className="bg-white rounded-2xl p-4 border border-[#e0e2d9] flex items-center gap-4"
              >
                <button className="cursor-grab hover:bg-[#f6f7f5] p-2 rounded-lg transition-colors">
                  <GripVertical className="w-5 h-5 text-[#676b5f]" />
                </button>
                
                <div 
                  className="flex-1 flex items-center gap-4 cursor-pointer"
                  onClick={() => handleEditBlock(block)}
                >
                  <div className="w-10 h-10 bg-[#f6f7f5] rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#676b5f]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {renderBlockPreview(block)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBlock(block.id);
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      block.isActive
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {block.isActive ? 'Active' : 'Inactive'}
                  </button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmOpen(true);
                      setBlockToDelete(block);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Block Type Selection Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose a Block Type</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {blockTypes.map((blockType) => {
              const Icon = blockType.icon;
              return (
                <button
                  key={blockType.type}
                  onClick={() => handleSelectBlockType(blockType.type)}
                  className={`p-6 rounded-xl border-2 border-[#e0e2d9] hover:border-[#8129d9] transition-all text-left group ${blockType.color}`}
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-black mb-1">{blockType.title}</h3>
                  <p className="text-sm text-[#676b5f]">{blockType.description}</p>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Block Form Dialog */}
      <Dialog open={showBlockForm} onOpenChange={(open) => {
        setShowBlockForm(open);
        if (!open) {
          // Reset editingBlock when dialog closes
          setEditingBlock(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBlock ? (
                <>
                  {selectedBlockType === 'ecommerce' && 'Edit Product'}
                  {selectedBlockType === 'donate' && 'Edit Donation Block'}
                  {selectedBlockType === 'contact' && 'Edit Contact Form'}
                  {selectedBlockType === 'chat' && 'Edit Quick Chat'}
                </>
              ) : (
                <>
                  {selectedBlockType === 'ecommerce' && 'Add Product'}
                  {selectedBlockType === 'donate' && 'Add Donation Block'}
                  {selectedBlockType === 'contact' && 'Add Contact Form'}
                  {selectedBlockType === 'chat' && 'Add Quick Chat'}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* E-commerce Block Form */}
            {selectedBlockType === 'ecommerce' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="product-url">Product URL</Label>
                  <Input
                    id="product-url"
                    type="url"
                    placeholder="https://shopee.vn/... or https://lazada.vn/..."
                    value={ecommerceUrl}
                    onChange={(e) => setEcommerceUrl(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-[#676b5f]">
                    Paste a product link from Shopee or Lazada
                  </p>
                </div>
              </>
            )}

            {/* Donate Block Form */}
            {selectedBlockType === 'donate' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="donate-title">Button Title *</Label>
                  <Input
                    id="donate-title"
                    type="text"
                    placeholder="e.g., Support My Work"
                    value={donateTitle}
                    onChange={(e) => setDonateTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method *</Label>
                  <Select value={donateMethod} onValueChange={(value: any) => setDonateMethod(value)}>
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vietqr">VietQR</SelectItem>
                      <SelectItem value="momo">Momo</SelectItem>
                      <SelectItem value="zalopay">ZaloPay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {donateMethod === 'vietqr' ? (
                  <div className="space-y-2">
                    <Label>QR Code Image *</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpg,image/jpeg"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    {qrImagePreview ? (
                      <div className="relative">
                        <img 
                          src={qrImagePreview} 
                          alt="QR Code Preview" 
                          className="w-full h-48 object-contain bg-gray-50 rounded-lg border-2 border-[#e0e2d9]"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-[#e0e2d9] rounded-lg flex flex-col items-center justify-center gap-2 hover:border-[#8129d9] hover:bg-[#f6f7f5] transition-all"
                      >
                        <Upload className="w-8 h-8 text-[#676b5f]" />
                        <p className="text-sm text-[#676b5f]">Click to upload QR code</p>
                        <p className="text-xs text-[#676b5f]">PNG, JPG, JPEG (Max 5MB)</p>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="payment-link">
                      {donateMethod === 'momo' ? 'Momo Payment Link' : 'ZaloPay Payment Link'} *
                    </Label>
                    <Input
                      id="payment-link"
                      type="url"
                      placeholder={donateMethod === 'momo' ? 'https://me.momo.vn/...' : 'https://zalopay.vn/...'}
                      value={donatePaymentLink}
                      onChange={(e) => setDonatePaymentLink(e.target.value)}
                    />
                    <p className="text-xs text-[#676b5f]">
                      {donateMethod === 'momo' 
                        ? 'Your Momo payment link (opens app on mobile)'
                        : 'Your ZaloPay payment link (opens app on mobile)'}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Contact Form Block */}
            {selectedBlockType === 'contact' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="contact-title">Form Title *</Label>
                  <Input
                    id="contact-title"
                    type="text"
                    value={contactTitle}
                    onChange={(e) => setContactTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Your Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                  <p className="text-xs text-[#676b5f]">
                    Visitor messages will be sent to this email
                  </p>
                </div>
              </>
            )}

            {/* Chat Block Form */}
            {selectedBlockType === 'chat' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="chat-title">Button Title</Label>
                  <Input
                    id="chat-title"
                    type="text"
                    placeholder="Chat on Zalo"
                    value={chatTitle}
                    onChange={(e) => setChatTitle(e.target.value)}
                  />
                  <p className="text-xs text-[#676b5f]">
                    Leave empty to use default title
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Zalo Phone Number *</Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="0123456789"
                    value={chatPhoneNumber}
                    onChange={(e) => setChatPhoneNumber(e.target.value)}
                  />
                  <p className="text-xs text-[#676b5f]">
                    10 digits starting with 0
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chat-message">Pre-filled Message</Label>
                  <Input
                    id="chat-message"
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowBlockForm(false)}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddBlock}
                className="flex-1 bg-[#8129d9] hover:bg-[#6920b0] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#676b5f]">
            Are you sure you want to delete this block? This action cannot be undone.
          </p>
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (blockToDelete) {
                  deleteBlock(blockToDelete.id);
                }
                setDeleteConfirmOpen(false);
              }}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}