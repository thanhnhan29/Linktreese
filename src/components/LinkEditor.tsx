import { useState, useRef } from 'react';
import { Plus, GripVertical, Trash2, ExternalLink, ChevronUp, ChevronDown, X, Upload, ShoppingBag, Heart, Mail, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import ProfileEditor from './ProfileEditor';
import { toast } from 'sonner';

interface Link {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  type?: 'social' | 'ecommerce' | 'donate' | 'contact' | 'chat' | 'regular';
  platform?: string;
  data?: any;
}

interface User {
  username: string;
  email: string;
}

interface LinkEditorProps {
  links: Link[];
  user: User;
  profileImage: string;
  bio: string;
  onAddLink: (title: string, url: string, type?: string, platform?: string, data?: any) => void;
  onUpdateLink: (id: string, title: string, url: string, type?: string, platform?: string, data?: any) => void;
  onDeleteLink: (id: string) => void;
  onToggleLink: (id: string) => void;
  onMoveLink: (id: string, direction: 'up' | 'down') => void;
  onUpdateProfile: (profileImage: string, bio: string) => void;
}

export default function LinkEditor({
  links,
  user,
  profileImage,
  bio,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onToggleLink,
  onMoveLink,
  onUpdateProfile,
}: LinkEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [linkType, setLinkType] = useState<'social' | 'ecommerce' | 'donate' | 'contact' | 'chat'>('social');
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [draggedLink, setDraggedLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<Link | null>(null);

  // E-commerce form states
  const [ecommerceUrl, setEcommerceUrl] = useState('');
  const [detectedEcommercePlatform, setDetectedEcommercePlatform] = useState<'shopee' | 'lazada' | null>(null);

  // Donate form states
  const [donateTitle, setDonateTitle] = useState('');
  const [donateMethod, setDonateMethod] = useState<'momo' | 'zalopay' | 'vietqr'>('vietqr');
  const [donateQRImage, setDonateQRImage] = useState('');
  const [donatePaymentLink, setDonatePaymentLink] = useState('');
  const [qrImagePreview, setQrImagePreview] = useState('');
  const [paymentLinkValid, setPaymentLinkValid] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Contact form states
  const [contactTitle, setContactTitle] = useState('Contact Me');
  const [contactEmail, setContactEmail] = useState('');
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  // Chat form states
  const [chatTitle, setChatTitle] = useState('Chat on Zalo');
  const [chatPhoneNumber, setChatPhoneNumber] = useState('');
  const [chatMessage, setChatMessage] = useState('Hello! I need help.');
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);

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
    
    if (lowercaseUrl.includes('instagram.com')) return 'instagram';
    if (lowercaseUrl.includes('tiktok.com')) return 'tiktok';
    if (lowercaseUrl.includes('facebook.com') || lowercaseUrl.includes('fb.com')) return 'facebook';
    if (lowercaseUrl.includes('twitter.com') || lowercaseUrl.includes('x.com')) return 'x';
    if (lowercaseUrl.includes('pinterest.com')) return 'pinterest';
    if (lowercaseUrl.includes('snapchat.com')) return 'snapchat';
    if (lowercaseUrl.includes('whatsapp.com') || lowercaseUrl.includes('wa.me')) return 'whatsapp';
    if (lowercaseUrl.includes('reddit.com')) return 'reddit';
    if (lowercaseUrl.includes('twitch.tv')) return 'twitch';
    if (lowercaseUrl.includes('youtube.com') || lowercaseUrl.includes('youtu.be')) return 'youtube';
    
    return null;
  };

  // Update URL and detect platform
  const handleUrlChange = (url: string) => {
    setNewLinkUrl(url);
    if (linkType === 'social') {
      const platform = detectSocialPlatform(url);
      setDetectedPlatform(platform);
    }
  };

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

  const mockFetchProductData = async (url: string, platform: 'shopee' | 'lazada') => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file format. Please upload PNG, JPG, or JPEG images only.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large. Please upload an image smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setQrImagePreview(result);
      setDonateQRImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setQrImagePreview('');
    setDonateQRImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setNewLinkTitle('');
    setNewLinkUrl('');
    setDetectedPlatform(null);
    setEditingLink(null);
    setEcommerceUrl('');
    setDetectedEcommercePlatform(null);
    setDonateTitle('');
    setDonateMethod('vietqr');
    setDonateQRImage('');
    setDonatePaymentLink('');
    setQrImagePreview('');
    setPaymentLinkValid(null);
    setContactTitle('Contact Me');
    setContactEmail('');
    setEmailValid(null);
    setChatTitle('Chat on Zalo');
    setChatPhoneNumber('');
    setChatMessage('Hello! I need help.');
    setPhoneValid(null);
    setIsLoading(false);
    setErrors({});
  };

  const handleAddLink = async () => {
    // Clear previous errors
    setErrors({});
    
    if (linkType === 'social') {
      const newErrors: any = {};
      if (!newLinkTitle.trim()) {
        newErrors.socialTitle = 'Title is required';
      }
      if (!newLinkUrl.trim()) {
        newErrors.socialUrl = 'URL is required';
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      const platform = detectedPlatform;
      onAddLink(newLinkTitle, newLinkUrl, 'social', platform || undefined);
      toast.success('Link added successfully!');
      resetForm();
      setIsDialogOpen(false);
    } else if (linkType === 'ecommerce') {
      const newErrors: any = {};
      
      if (!ecommerceUrl.trim()) {
        newErrors.ecommerceUrl = 'Product URL is required';
        setErrors(newErrors);
        return;
      }
      
      const validation = validateEcommerceUrl(ecommerceUrl);
      if (!validation.valid) {
        newErrors.ecommerceUrl = 'Unsupported URL. Please use links from Shopee or Lazada';
        setErrors(newErrors);
        return;
      }

      setIsLoading(true);
      try {
        const productData = await mockFetchProductData(ecommerceUrl, validation.platform!);
        onAddLink(productData.title, productData.url, 'ecommerce', validation.platform, productData);
        toast.success('Product added successfully!');
        resetForm();
        setIsDialogOpen(false);
      } catch (error) {
        newErrors.ecommerceUrl = 'Failed to fetch product data. Please try again';
        setErrors(newErrors);
      } finally {
        setIsLoading(false);
      }
    } else if (linkType === 'donate') {
      const newErrors: any = {};
      
      if (!donateTitle.trim()) {
        newErrors.donateTitle = 'Button title is required';
      }
      
      if (donateMethod === 'vietqr') {
        if (!donateQRImage) {
          newErrors.donateQR = 'Please upload a QR code image';
        }
      } else {
        if (!donatePaymentLink.trim()) {
          newErrors.donatePaymentLink = 'Payment link is required';
        } else if (paymentLinkValid === false) {
          newErrors.donatePaymentLink = `Invalid ${donateMethod === 'momo' ? 'Momo' : 'ZaloPay'} payment link`;
        }
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const donateData = {
        title: donateTitle,
        method: donateMethod,
        qrImage: donateMethod === 'vietqr' ? donateQRImage : undefined,
        paymentLink: donateMethod !== 'vietqr' ? donatePaymentLink : undefined,
      };

      onAddLink(donateTitle, '', 'donate', donateMethod, donateData);
      toast.success('Donation block added successfully!');
      resetForm();
      setIsDialogOpen(false);
    } else if (linkType === 'contact') {
      const newErrors: any = {};
      
      if (!contactTitle.trim()) {
        newErrors.contactTitle = 'Form title is required';
      }
      
      if (!contactEmail.trim()) {
        newErrors.contactEmail = 'Email address is required';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail)) {
          newErrors.contactEmail = 'Please enter a valid email address';
        }
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const contactData = {
        title: contactTitle,
        receiverEmail: contactEmail,
      };

      onAddLink(contactTitle, '', 'contact', undefined, contactData);
      toast.success('Contact form added successfully!');
      resetForm();
      setIsDialogOpen(false);
    } else if (linkType === 'chat') {
      const newErrors: any = {};
      
      if (!chatPhoneNumber.trim()) {
        newErrors.chatPhone = 'Phone number is required';
      } else {
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(chatPhoneNumber.trim())) {
          newErrors.chatPhone = 'Invalid phone number. Please enter 10 digits starting with 0';
        }
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const finalTitle = chatTitle.trim() || 'Chat on Zalo';
      const chatData = {
        title: finalTitle,
        phoneNumber: chatPhoneNumber,
        message: chatMessage,
      };

      const zaloUrl = `https://zalo.me/${chatPhoneNumber}`;
      onAddLink(finalTitle, zaloUrl, 'chat', undefined, chatData);
      toast.success('Quick chat added successfully!');
      resetForm();
      setIsDialogOpen(false);
    }
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setLinkType(link.type || 'social');
    setIsDialogOpen(true);
    
    // Load data based on link type
    if (link.type === 'social') {
      setNewLinkTitle(link.title);
      setNewLinkUrl(link.url);
      setDetectedPlatform(link.platform || null);
    } else if (link.type === 'ecommerce') {
      setEcommerceUrl(link.data?.url || link.url || '');
      setDetectedEcommercePlatform(link.platform as 'shopee' | 'lazada' || null);
    } else if (link.type === 'donate') {
      setDonateTitle(link.data?.title || link.title || '');
      setDonateMethod(link.data?.method || 'vietqr');
      if (link.data?.method === 'vietqr' && link.data?.qrImage) {
        setDonateQRImage(link.data.qrImage);
        setQrImagePreview(link.data.qrImage);
      } else {
        setDonatePaymentLink(link.data?.paymentLink || '');
      }
    } else if (link.type === 'contact') {
      setContactTitle(link.data?.title || link.title || 'Contact Me');
      setContactEmail(link.data?.receiverEmail || '');
    } else if (link.type === 'chat') {
      setChatTitle(link.data?.title || link.title || 'Chat on Zalo');
      setChatPhoneNumber(link.data?.phoneNumber || '');
      setChatMessage(link.data?.message || 'Hello! I need help.');
    }
  };

  const handleUpdateLink = async () => {
    if (!editingLink) return;
    
    // Clear previous errors
    setErrors({});
    
    if (linkType === 'social') {
      const newErrors: any = {};
      if (!newLinkTitle.trim()) {
        newErrors.socialTitle = 'Title is required';
      }
      if (!newLinkUrl.trim()) {
        newErrors.socialUrl = 'URL is required';
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      const platform = detectedPlatform;
      onUpdateLink(editingLink.id, newLinkTitle, newLinkUrl, 'social', platform || undefined);
      toast.success('Link updated successfully!');
      resetForm();
      setIsDialogOpen(false);
    } else if (linkType === 'ecommerce') {
      const newErrors: any = {};
      
      if (!ecommerceUrl.trim()) {
        newErrors.ecommerceUrl = 'Product URL is required';
        setErrors(newErrors);
        return;
      }
      
      const validation = validateEcommerceUrl(ecommerceUrl);
      if (!validation.valid) {
        newErrors.ecommerceUrl = 'Unsupported URL. Please use links from Shopee or Lazada';
        setErrors(newErrors);
        return;
      }

      setIsLoading(true);
      try {
        const productData = await mockFetchProductData(ecommerceUrl, validation.platform!);
        onUpdateLink(editingLink.id, productData.title, productData.url, 'ecommerce', validation.platform, productData);
        toast.success('Product updated successfully!');
        resetForm();
        setIsDialogOpen(false);
      } catch (error) {
        newErrors.ecommerceUrl = 'Failed to fetch product data. Please try again';
        setErrors(newErrors);
      } finally {
        setIsLoading(false);
      }
    } else if (linkType === 'donate') {
      const newErrors: any = {};
      
      if (!donateTitle.trim()) {
        newErrors.donateTitle = 'Button title is required';
      }
      
      if (donateMethod === 'vietqr') {
        if (!donateQRImage) {
          newErrors.donateQR = 'Please upload a QR code image';
        }
      } else {
        if (!donatePaymentLink.trim()) {
          newErrors.donatePaymentLink = 'Payment link is required';
        } else if (paymentLinkValid === false) {
          newErrors.donatePaymentLink = `Invalid ${donateMethod === 'momo' ? 'Momo' : 'ZaloPay'} payment link`;
        }
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const donateData = {
        title: donateTitle,
        method: donateMethod,
        qrImage: donateMethod === 'vietqr' ? donateQRImage : undefined,
        paymentLink: donateMethod !== 'vietqr' ? donatePaymentLink : undefined,
      };

      onUpdateLink(editingLink.id, donateTitle, '', 'donate', donateMethod, donateData);
      toast.success('Donation block updated successfully!');
      resetForm();
      setIsDialogOpen(false);
    } else if (linkType === 'contact') {
      const newErrors: any = {};
      
      if (!contactTitle.trim()) {
        newErrors.contactTitle = 'Form title is required';
      }
      
      if (!contactEmail.trim()) {
        newErrors.contactEmail = 'Email address is required';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail)) {
          newErrors.contactEmail = 'Please enter a valid email address';
        }
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const contactData = {
        title: contactTitle,
        receiverEmail: contactEmail,
      };

      onUpdateLink(editingLink.id, contactTitle, '', 'contact', undefined, contactData);
      toast.success('Contact form updated successfully!');
      resetForm();
      setIsDialogOpen(false);
    } else if (linkType === 'chat') {
      const newErrors: any = {};
      
      if (!chatPhoneNumber.trim()) {
        newErrors.chatPhone = 'Phone number is required';
      } else {
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(chatPhoneNumber.trim())) {
          newErrors.chatPhone = 'Invalid phone number. Please enter 10 digits starting with 0';
        }
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const finalTitle = chatTitle.trim() || 'Chat on Zalo';
      const chatData = {
        title: finalTitle,
        phoneNumber: chatPhoneNumber,
        message: chatMessage,
      };

      const zaloUrl = `https://zalo.me/${chatPhoneNumber}`;
      onUpdateLink(editingLink.id, finalTitle, zaloUrl, 'chat', undefined, chatData);
      toast.success('Quick chat updated successfully!');
      resetForm();
      setIsDialogOpen(false);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, linkId: string) => {
    setDraggedLink(linkId);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedLink(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetLinkId: string) => {
    e.preventDefault();
    
    if (!draggedLink || draggedLink === targetLinkId) return;

    const draggedIndex = links.findIndex(link => link.id === draggedLink);
    const targetIndex = links.findIndex(link => link.id === targetLinkId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    if (draggedIndex < targetIndex) {
      for (let i = draggedIndex; i < targetIndex; i++) {
        onMoveLink(draggedLink, 'down');
      }
    } else {
      for (let i = draggedIndex; i > targetIndex; i--) {
        onMoveLink(draggedLink, 'up');
      }
    }
  };

  const getLinkTypeDisplay = (link: Link) => {
    if (link.type === 'ecommerce') {
      return (
        <div className="flex items-center gap-3">
          <img 
            src={link.data?.image} 
            alt={link.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-black truncate">{link.title}</p>
            <p className="text-sm text-[#676b5f]">{link.data?.price} • {link.data?.platform}</p>
          </div>
        </div>
      );
    } else if (link.type === 'donate') {
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-black">{link.title}</p>
            <p className="text-sm text-[#676b5f]">
              {link.data?.method === 'vietqr' ? 'VietQR' : link.data?.method === 'momo' ? 'Momo' : 'ZaloPay'} payment
            </p>
          </div>
        </div>
      );
    } else if (link.type === 'contact') {
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-black">{link.title}</p>
            <p className="text-sm text-[#676b5f]">Sends to: {link.data?.receiverEmail}</p>
          </div>
        </div>
      );
    } else if (link.type === 'chat') {
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-black">{link.title}</p>
            <p className="text-sm text-[#676b5f]">{link.data?.phoneNumber}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex-1">
          <p className="text-black">{link.title}</p>
          <p className="text-[#676b5f] flex items-center gap-1 text-sm">
            <ExternalLink className="w-3 h-3" />
            {link.url}
          </p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Editor with Upload */}
      <ProfileEditor
        profileImage={profileImage}
        bio={bio}
        onUpdateProfile={onUpdateProfile}
      />

      {/* Add Link Button */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          resetForm();
        }
      }}>
        <DialogTrigger asChild>
          <Button className="w-full bg-[#8129d9] hover:bg-[#7020c0] text-white rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="add-link-description">
          <DialogHeader>
            <DialogTitle>{editingLink ? 'Edit Link' : 'Add New Link'}</DialogTitle>
          </DialogHeader>
          <p id="add-link-description" className="sr-only">
            {editingLink ? 'Edit your existing link' : 'Add a new link to your profile'}
          </p>

          {/* Link Type Cards */}
          <div className="grid grid-cols-5 gap-3 mt-4">
            <button
              onClick={() => setLinkType('social')}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                linkType === 'social'
                  ? 'border-[#8129d9] bg-purple-50'
                  : 'border-[#e0e2d9] hover:border-[#8129d9]'
              }`}
            >
              <ExternalLink className={`w-6 h-6 mx-auto mb-2 ${linkType === 'social' ? 'text-[#8129d9]' : 'text-[#676b5f]'}`} />
              <p className="text-xs text-black">Social</p>
            </button>
            <button
              onClick={() => setLinkType('ecommerce')}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                linkType === 'ecommerce'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-[#e0e2d9] hover:border-orange-500'
              }`}
            >
              <ShoppingBag className={`w-6 h-6 mx-auto mb-2 ${linkType === 'ecommerce' ? 'text-orange-600' : 'text-[#676b5f]'}`} />
              <p className="text-xs text-black">Product</p>
            </button>
            <button
              onClick={() => setLinkType('donate')}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                linkType === 'donate'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-[#e0e2d9] hover:border-pink-500'
              }`}
            >
              <Heart className={`w-6 h-6 mx-auto mb-2 ${linkType === 'donate' ? 'text-pink-600' : 'text-[#676b5f]'}`} />
              <p className="text-xs text-black">Donate</p>
            </button>
            <button
              onClick={() => setLinkType('contact')}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                linkType === 'contact'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-[#e0e2d9] hover:border-blue-500'
              }`}
            >
              <Mail className={`w-6 h-6 mx-auto mb-2 ${linkType === 'contact' ? 'text-blue-600' : 'text-[#676b5f]'}`} />
              <p className="text-xs text-black">Contact</p>
            </button>
            <button
              onClick={() => setLinkType('chat')}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                linkType === 'chat'
                  ? 'border-green-500 bg-green-50'
                  : 'border-[#e0e2d9] hover:border-green-500'
              }`}
            >
              <MessageCircle className={`w-6 h-6 mx-auto mb-2 ${linkType === 'chat' ? 'text-green-600' : 'text-[#676b5f]'}`} />
              <p className="text-xs text-black">Chat</p>
            </button>
          </div>

          <div className="space-y-4 mt-6">
            {/* Social Media Form */}
            {linkType === 'social' && (
              <>
                <div>
                  <label className="block mb-2 text-black">Title</label>
                  <input
                    type="text"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    placeholder="Follow me on Instagram"
                    className={`w-full px-4 py-2 bg-[#f6f7f5] rounded-lg text-black placeholder:text-[#676b5f] ${
                      errors.socialTitle ? 'border-2 border-red-500' : ''
                    }`}
                  />
                  {errors.socialTitle && (
                    <p className="text-xs text-red-500 mt-1">{errors.socialTitle}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-black">URL</label>
                  <input
                    type="url"
                    value={newLinkUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://instagram.com/yourname"
                    className={`w-full px-4 py-2 bg-[#f6f7f5] rounded-lg text-black placeholder:text-[#676b5f] ${
                      errors.socialUrl ? 'border-2 border-red-500' : ''
                    }`}
                  />
                  {detectedPlatform && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Detected: {detectedPlatform.charAt(0).toUpperCase() + detectedPlatform.slice(1)}
                    </div>
                  )}
                  {newLinkUrl && !detectedPlatform && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-amber-600">
                      <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                      Platform not recognized - will show as regular link
                    </div>
                  )}
                  {errors.socialUrl && (
                    <p className="text-xs text-red-500 mt-1">{errors.socialUrl}</p>
                  )}
                </div>
              </>
            )}

            {/* E-commerce Form */}
            {linkType === 'ecommerce' && (
              <div className="space-y-2">
                <Label htmlFor="product-url">Product URL</Label>
                <Input
                  id="product-url"
                  type="url"
                  placeholder="https://shopee.vn/... or https://lazada.vn/..."
                  value={ecommerceUrl}
                  onChange={(e) => {
                    const url = e.target.value;
                    setEcommerceUrl(url);
                    // Real-time detection
                    if (url) {
                      const validation = validateEcommerceUrl(url);
                      setDetectedEcommercePlatform(validation.platform || null);
                    } else {
                      setDetectedEcommercePlatform(null);
                    }
                  }}
                  disabled={isLoading}
                />
                <p className="text-xs text-[#676b5f]">
                  Paste a product link from Shopee or Lazada
                </p>
                {detectedEcommercePlatform && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Detected: {detectedEcommercePlatform.charAt(0).toUpperCase() + detectedEcommercePlatform.slice(1)}
                  </div>
                )}
                {ecommerceUrl && !detectedEcommercePlatform && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Unsupported platform - only Shopee and Lazada are supported
                  </div>
                )}
                {errors.ecommerceUrl && (
                  <p className="text-xs text-red-500">{errors.ecommerceUrl}</p>
                )}
              </div>
            )}

            {/* Donate Form */}
            {linkType === 'donate' && (
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
                  {errors.donateTitle && (
                    <p className="text-xs text-red-500">{errors.donateTitle}</p>
                  )}
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
                    {errors.donateQR && (
                      <p className="text-xs text-red-500">{errors.donateQR}</p>
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
                      onChange={(e) => {
                        const link = e.target.value;
                        setDonatePaymentLink(link);
                        // Real-time validation
                        if (link) {
                          if (donateMethod === 'momo') {
                            setPaymentLinkValid(link.includes('me.momo.vn') || link.includes('momo.vn'));
                          } else {
                            setPaymentLinkValid(link.includes('zalopay.vn'));
                          }
                        } else {
                          setPaymentLinkValid(null);
                        }
                      }}
                    />
                    <p className="text-xs text-[#676b5f]">
                      {donateMethod === 'momo' 
                        ? 'Your Momo payment link (opens app on mobile)'
                        : 'Your ZaloPay payment link (opens app on mobile)'}
                    </p>
                    {paymentLinkValid === true && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Valid {donateMethod === 'momo' ? 'Momo' : 'ZaloPay'} link detected
                      </div>
                    )}
                    {paymentLinkValid === false && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                        Invalid {donateMethod === 'momo' ? 'Momo' : 'ZaloPay'} link
                      </div>
                    )}
                    {errors.donatePaymentLink && (
                      <p className="text-xs text-red-500">{errors.donatePaymentLink}</p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Contact Form */}
            {linkType === 'contact' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="contact-title">Form Title *</Label>
                  <Input
                    id="contact-title"
                    type="text"
                    value={contactTitle}
                    onChange={(e) => setContactTitle(e.target.value)}
                  />
                  {errors.contactTitle && (
                    <p className="text-xs text-red-500">{errors.contactTitle}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Your Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    onBlur={() => {
                      if (contactEmail) {
                        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        setEmailValid(regex.test(contactEmail));
                      } else {
                        setEmailValid(null);
                      }
                    }}
                  />
                  <p className="text-xs text-[#676b5f]">
                    Visitor messages will be sent to this email
                  </p>
                  {emailValid === false && (
                    <p className="text-xs text-red-500">Invalid email address.</p>
                  )}
                  {errors.contactEmail && (
                    <p className="text-xs text-red-500">{errors.contactEmail}</p>
                  )}
                </div>
              </>
            )}

            {/* Chat Form */}
            {linkType === 'chat' && (
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
                    onBlur={() => {
                      if (chatPhoneNumber) {
                        const regex = /^0\d{9}$/;
                        setPhoneValid(regex.test(chatPhoneNumber));
                      } else {
                        setPhoneValid(null);
                      }
                    }}
                  />
                  <p className="text-xs text-[#676b5f]">
                    10 digits starting with 0
                  </p>
                  {phoneValid === false && (
                    <p className="text-xs text-red-500">Invalid phone number.</p>
                  )}
                  {errors.chatPhone && (
                    <p className="text-xs text-red-500">{errors.chatPhone}</p>
                  )}
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

            <Button
              onClick={editingLink ? handleUpdateLink : handleAddLink}
              className="w-full bg-[#8129d9] hover:bg-[#7020c0]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                editingLink ? 'Update Link' : 'Add Link'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Links List */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <div className="bg-white rounded-lg p-8 border border-[#e0e2d9] text-center">
            <p className="text-[#676b5f]">No links yet. Click "Add Link" to get started!</p>
          </div>
        ) : (
          links.map((link, index) => (
            <div
              key={link.id}
              className="bg-white rounded-2xl p-4 border border-[#e0e2d9] hover:border-[#8129d9] transition-colors"
              draggable
              onDragStart={(e) => handleDragStart(e, link.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, link.id)}
            >
              <div className="flex items-center gap-3">
                <button 
                  className="cursor-grab hover:bg-[#f6f7f5] p-2 rounded-lg transition-colors"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <GripVertical className="w-5 h-5 text-[#676b5f]" />
                </button>
                
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleEditLink(link)}
                >
                  {getLinkTypeDisplay(link)}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLink(link.id, 'up');
                      }}
                      disabled={index === 0}
                      className="p-1 hover:bg-[#f6f7f5] rounded disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4 text-[#676b5f]" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLink(link.id, 'down');
                      }}
                      disabled={index === links.length - 1}
                      className="p-1 hover:bg-[#f6f7f5] rounded disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4 text-[#676b5f]" />
                    </button>
                  </div>

                  <Switch
                    checked={link.isActive}
                    onCheckedChange={(checked) => {
                      onToggleLink(link.id);
                    }}
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLinkToDelete(link);
                      setDeleteConfirmOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" aria-describedby="delete-link-description">
          <DialogHeader>
            <DialogTitle>Confirm Delete Link</DialogTitle>
          </DialogHeader>
          <p id="delete-link-description" className="sr-only">
            Are you sure you want to delete this link?
          </p>

          <div className="space-y-4 mt-6">
            <p className="text-sm text-[#676b5f]">
              Are you sure you want to delete the link "{linkToDelete?.title}"?
            </p>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => {
                  if (linkToDelete) {
                    onDeleteLink(linkToDelete.id);
                    toast.success('Link deleted successfully!');
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
    </div>
  );
}