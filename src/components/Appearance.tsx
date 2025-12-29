import { useState, useEffect } from 'react';
import { Palette, Type, Square, Upload, Sparkles, Paintbrush } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner';

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

interface AppearanceProps {
  username: string;
  onConfigChange: (config: AppearanceConfig) => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  config: AppearanceConfig;
  preview: {
    colors: string[];
    isDark?: boolean;
  };
}

const GOOGLE_FONTS = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Merriweather', value: 'Merriweather' },
  { name: 'Raleway', value: 'Raleway' },
  { name: 'Nunito', value: 'Nunito' },
];

const DEFAULT_CONFIG: AppearanceConfig = {
  background: {
    type: 'solid',
    solidColor: '#ffffff',
    gradientStart: '#8129d9',
    gradientEnd: '#43E660',
    gradientDirection: 'to-b',
    imageUrl: '',
  },
  buttons: {
    style: 'rounded',
    backgroundColor: '#8129d9',
    textColor: '#ffffff',
    borderColor: '#8129d9',
    hasShadow: true,
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  textColors: {
    username: '#000000',
    description: '#676b5f',
  },
};

const TEMPLATES: Template[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and simple white background',
    preview: { colors: ['#ffffff', '#000000'] },
    config: {
      background: {
        type: 'solid',
        solidColor: '#ffffff',
        gradientStart: '#ffffff',
        gradientEnd: '#ffffff',
        gradientDirection: 'to-b',
        imageUrl: '',
      },
      buttons: {
        style: 'pill',
        backgroundColor: '#000000',
        textColor: '#ffffff',
        borderColor: '#000000',
        hasShadow: false,
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      textColors: {
        username: '#000000',
        description: '#676b5f',
      },
    },
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    description: 'Sleek dark theme with purple accents',
    preview: { colors: ['#0f0f0f', '#8b5cf6'], isDark: true },
    config: {
      background: {
        type: 'solid',
        solidColor: '#0f0f0f',
        gradientStart: '#0f0f0f',
        gradientEnd: '#0f0f0f',
        gradientDirection: 'to-b',
        imageUrl: '',
      },
      buttons: {
        style: 'rounded',
        backgroundColor: '#8b5cf6',
        textColor: '#ffffff',
        borderColor: '#8b5cf6',
        hasShadow: true,
      },
      fonts: {
        heading: 'Poppins',
        body: 'Inter',
      },
      textColors: {
        username: '#ffffff',
        description: '#a8a29e',
      },
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Vibes',
    description: 'Warm gradient from orange to pink',
    preview: { colors: ['#ff6b6b', '#feca57', '#ee5a6f'] },
    config: {
      background: {
        type: 'gradient',
        solidColor: '#ffffff',
        gradientStart: '#ff6b6b',
        gradientEnd: '#feca57',
        gradientDirection: 'to-br',
        imageUrl: '',
      },
      buttons: {
        style: 'pill',
        backgroundColor: '#ffffff',
        textColor: '#ff6b6b',
        borderColor: '#ffffff',
        hasShadow: true,
      },
      fonts: {
        heading: 'Montserrat',
        body: 'Open Sans',
      },
      textColors: {
        username: '#000000',
        description: '#676b5f',
      },
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Cool blue gradient like the ocean',
    preview: { colors: ['#0093E9', '#80D0C7'] },
    config: {
      background: {
        type: 'gradient',
        solidColor: '#ffffff',
        gradientStart: '#0093E9',
        gradientEnd: '#80D0C7',
        gradientDirection: 'to-b',
        imageUrl: '',
      },
      buttons: {
        style: 'rounded',
        backgroundColor: '#ffffff',
        textColor: '#0093E9',
        borderColor: '#ffffff',
        hasShadow: true,
      },
      fonts: {
        heading: 'Raleway',
        body: 'Lato',
      },
      textColors: {
        username: '#000000',
        description: '#676b5f',
      },
    },
  },
  {
    id: 'nature',
    name: 'Nature Green',
    description: 'Fresh and natural green tones',
    preview: { colors: ['#11998e', '#38ef7d'] },
    config: {
      background: {
        type: 'gradient',
        solidColor: '#ffffff',
        gradientStart: '#11998e',
        gradientEnd: '#38ef7d',
        gradientDirection: 'to-br',
        imageUrl: '',
      },
      buttons: {
        style: 'pill',
        backgroundColor: '#ffffff',
        textColor: '#11998e',
        borderColor: '#ffffff',
        hasShadow: false,
      },
      fonts: {
        heading: 'Nunito',
        body: 'Open Sans',
      },
      textColors: {
        username: '#000000',
        description: '#676b5f',
      },
    },
  },
  {
    id: 'pastel',
    name: 'Pastel Dream',
    description: 'Soft pastel pink to lavender',
    preview: { colors: ['#ffecd2', '#fcb69f'] },
    config: {
      background: {
        type: 'gradient',
        solidColor: '#ffffff',
        gradientStart: '#ffecd2',
        gradientEnd: '#fcb69f',
        gradientDirection: 'to-b',
        imageUrl: '',
      },
      buttons: {
        style: 'pill',
        backgroundColor: '#ff9a9e',
        textColor: '#ffffff',
        borderColor: '#ff9a9e',
        hasShadow: true,
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Lato',
      },
      textColors: {
        username: '#000000',
        description: '#676b5f',
      },
    },
  },
  {
    id: 'neon',
    name: 'Neon Nights',
    description: 'Dark with vibrant neon accents',
    preview: { colors: ['#141E30', '#00F260'], isDark: true },
    config: {
      background: {
        type: 'gradient',
        solidColor: '#000000',
        gradientStart: '#141E30',
        gradientEnd: '#243B55',
        gradientDirection: 'to-b',
        imageUrl: '',
      },
      buttons: {
        style: 'rounded',
        backgroundColor: '#00F260',
        textColor: '#000000',
        borderColor: '#00F260',
        hasShadow: true,
      },
      fonts: {
        heading: 'Montserrat',
        body: 'Roboto',
      },
      textColors: {
        username: '#ffffff',
        description: '#a8a29e',
      },
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate navy blue theme',
    preview: { colors: ['#1e3c72', '#2a5298'] },
    config: {
      background: {
        type: 'gradient',
        solidColor: '#ffffff',
        gradientStart: '#1e3c72',
        gradientEnd: '#2a5298',
        gradientDirection: 'to-br',
        imageUrl: '',
      },
      buttons: {
        style: 'rounded',
        backgroundColor: '#ffffff',
        textColor: '#1e3c72',
        borderColor: '#ffffff',
        hasShadow: true,
      },
      fonts: {
        heading: 'Roboto',
        body: 'Open Sans',
      },
      textColors: {
        username: '#000000',
        description: '#676b5f',
      },
    },
  },
  {
    id: 'lavender',
    name: 'Lavender Fields',
    description: 'Calming purple to pink gradient',
    preview: { colors: ['#a8edea', '#fed6e3'] },
    config: {
      background: {
        type: 'gradient',
        solidColor: '#ffffff',
        gradientStart: '#a8edea',
        gradientEnd: '#fed6e3',
        gradientDirection: 'to-r',
        imageUrl: '',
      },
      buttons: {
        style: 'pill',
        backgroundColor: '#c471ed',
        textColor: '#ffffff',
        borderColor: '#c471ed',
        hasShadow: true,
      },
      fonts: {
        heading: 'Poppins',
        body: 'Nunito',
      },
      textColors: {
        username: '#000000',
        description: '#676b5f',
      },
    },
  },
  {
    id: 'fire',
    name: 'Fire & Ice',
    description: 'Bold red to orange gradient',
    preview: { colors: ['#f12711', '#f5af19'] },
    config: {
      background: {
        type: 'gradient',
        solidColor: '#ffffff',
        gradientStart: '#f12711',
        gradientEnd: '#f5af19',
        gradientDirection: 'to-br',
        imageUrl: '',
      },
      buttons: {
        style: 'rounded',
        backgroundColor: '#ffffff',
        textColor: '#f12711',
        borderColor: '#ffffff',
        hasShadow: true,
      },
      fonts: {
        heading: 'Montserrat',
        body: 'Raleway',
      },
      textColors: {
        username: '#000000',
        description: '#676b5f',
      },
    },
  },
  {
    id: 'elegant',
    name: 'Elegant Black',
    description: 'Sophisticated black and gold',
    preview: { colors: ['#000000', '#ffd700'], isDark: true },
    config: {
      background: {
        type: 'solid',
        solidColor: '#000000',
        gradientStart: '#000000',
        gradientEnd: '#000000',
        gradientDirection: 'to-b',
        imageUrl: '',
      },
      buttons: {
        style: 'square',
        backgroundColor: '#ffd700',
        textColor: '#000000',
        borderColor: '#ffd700',
        hasShadow: false,
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Merriweather',
      },
      textColors: {
        username: '#ffffff',
        description: '#a8a29e',
      },
    },
  },
  {
    id: 'peach',
    name: 'Peachy Keen',
    description: 'Warm peach to coral tones',
    preview: { colors: ['#ff9a56', '#ff6a88'] },
    config: {
      background: {
        type: 'gradient',
        solidColor: '#ffffff',
        gradientStart: '#ff9a56',
        gradientEnd: '#ff6a88',
        gradientDirection: 'to-b',
        imageUrl: '',
      },
      buttons: {
        style: 'pill',
        backgroundColor: '#ffffff',
        textColor: '#ff6a88',
        borderColor: '#ffffff',
        hasShadow: true,
      },
      fonts: {
        heading: 'Poppins',
        body: 'Lato',
      },
      textColors: {
        username: '#000000',
        description: '#676b5f',
      },
    },
  },
];

export default function Appearance({ username, onConfigChange }: AppearanceProps) {
  const [config, setConfig] = useState<AppearanceConfig>(DEFAULT_CONFIG);
  const [imagePreview, setImagePreview] = useState('');
  const [activeTab, setActiveTab] = useState<'design' | 'template'>('design');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    // Load saved appearance config
    const saved = localStorage.getItem(`appearance_${username}`);
    if (saved) {
      const savedConfig = JSON.parse(saved);
      // Merge with default config to handle missing fields (backward compatibility)
      const mergedConfig = {
        ...DEFAULT_CONFIG,
        ...savedConfig,
        background: { ...DEFAULT_CONFIG.background, ...savedConfig.background },
        buttons: { ...DEFAULT_CONFIG.buttons, ...savedConfig.buttons },
        fonts: { ...DEFAULT_CONFIG.fonts, ...savedConfig.fonts },
        textColors: { ...DEFAULT_CONFIG.textColors, ...(savedConfig.textColors || {}) },
      };
      setConfig(mergedConfig);
      if (savedConfig.background?.imageUrl) {
        setImagePreview(savedConfig.background.imageUrl);
      }
    }
  }, [username]);

  const updateConfig = (updates: Partial<AppearanceConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    localStorage.setItem(`appearance_${username}`, JSON.stringify(newConfig));
    onConfigChange(newConfig);
  };

  const updateBackground = (updates: Partial<AppearanceConfig['background']>) => {
    updateConfig({
      background: { ...config.background, ...updates },
    });
  };

  const updateButtons = (updates: Partial<AppearanceConfig['buttons']>) => {
    updateConfig({
      buttons: { ...config.buttons, ...updates },
    });
  };

  const updateFonts = (updates: Partial<AppearanceConfig['fonts']>) => {
    updateConfig({
      fonts: { ...config.fonts, ...updates },
    });
  };

  const updateTextColors = (updates: Partial<AppearanceConfig['textColors']>) => {
    updateConfig({
      textColors: { ...config.textColors, ...updates },
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Ảnh không hợp lệ, vui lòng chọn ảnh .JPG hoặc .PNG');
      e.target.value = ''; // Reset input
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ảnh không hợp lệ, vui lòng chọn ảnh dưới 2MB');
      e.target.value = ''; // Reset input
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      updateBackground({ imageUrl: result, type: 'image' });
      toast.success('Tải ảnh nền thành công');
    };
    reader.readAsDataURL(file);
  };

  const applyTemplate = (template: Template) => {
    setSelectedTemplate(template.id);
    setConfig(template.config);
    localStorage.setItem(`appearance_${username}`, JSON.stringify(template.config));
    onConfigChange(template.config);
    
    // Clear image preview if template doesn't use image
    if (template.config.background.type !== 'image') {
      setImagePreview('');
    }
  };

  const resetToDefault = () => {
    setConfig(DEFAULT_CONFIG);
    setImagePreview('');
    setSelectedTemplate(null);
    localStorage.setItem(`appearance_${username}`, JSON.stringify(DEFAULT_CONFIG));
    onConfigChange(DEFAULT_CONFIG);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-black">Appearance</h2>
          <p className="text-[#676b5f] mt-1">Customize how your page looks</p>
        </div>
        <Button
          onClick={resetToDefault}
          variant="outline"
          className="text-sm"
        >
          Reset to Default
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('design')}
          className={`px-6 py-3 -mb-px transition-all flex items-center gap-2 ${
            activeTab === 'design'
              ? 'border-b-2 border-[#8129d9] text-[#8129d9]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Paintbrush className="w-4 h-4" />
          Design
        </button>
        <button
          onClick={() => setActiveTab('template')}
          className={`px-6 py-3 -mb-px transition-all flex items-center gap-2 ${
            activeTab === 'template'
              ? 'border-b-2 border-[#8129d9] text-[#8129d9]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Templates
        </button>
      </div>

      {/* Design Tab */}
      {activeTab === 'design' && (
        <div className="space-y-6">
          {/* Background Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-[#8129d9]" />
              <h3 className="text-lg text-black">Background</h3>
            </div>

            {/* Background Type Selector */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => updateBackground({ type: 'solid' })}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                    config.background.type === 'solid'
                      ? 'border-[#8129d9] bg-[#8129d9]/10 text-[#8129d9]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Solid Color
                </button>
                <button
                  onClick={() => updateBackground({ type: 'gradient' })}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                    config.background.type === 'gradient'
                      ? 'border-[#8129d9] bg-[#8129d9]/10 text-[#8129d9]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Gradient
                </button>
                <button
                  onClick={() => updateBackground({ type: 'image' })}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                    config.background.type === 'image'
                      ? 'border-[#8129d9] bg-[#8129d9]/10 text-[#8129d9]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Image
                </button>
              </div>

              {/* Solid Color Picker */}
              {config.background.type === 'solid' && (
                <div>
                  <Label className="text-sm text-gray-700 mb-2 block">Background Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.background.solidColor}
                      onChange={(e) => updateBackground({ solidColor: e.target.value })}
                      className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200"
                    />
                    <input
                      type="text"
                      value={config.background.solidColor}
                      onChange={(e) => updateBackground({ solidColor: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              )}

              {/* Gradient Picker */}
              {config.background.type === 'gradient' && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">Gradient Start</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={config.background.gradientStart}
                        onChange={(e) => updateBackground({ gradientStart: e.target.value })}
                        className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200"
                      />
                      <input
                        type="text"
                        value={config.background.gradientStart}
                        onChange={(e) => updateBackground({ gradientStart: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="#8129d9"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">Gradient End</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={config.background.gradientEnd}
                        onChange={(e) => updateBackground({ gradientEnd: e.target.value })}
                        className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200"
                      />
                      <input
                        type="text"
                        value={config.background.gradientEnd}
                        onChange={(e) => updateBackground({ gradientEnd: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="#43E660"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">Direction</Label>
                    <select
                      value={config.background.gradientDirection}
                      onChange={(e) => updateBackground({ gradientDirection: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="to-b">Top to Bottom</option>
                      <option value="to-t">Bottom to Top</option>
                      <option value="to-r">Left to Right</option>
                      <option value="to-l">Right to Left</option>
                      <option value="to-br">Top-Left to Bottom-Right</option>
                      <option value="to-bl">Top-Right to Bottom-Left</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Image Upload */}
              {config.background.type === 'image' && (
                <div>
                  <Label className="text-sm text-gray-700 mb-2 block">Background Image</Label>
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleImageUpload}
                      />
                    </label>
                    {imagePreview && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden">
                        <img src={imagePreview} alt="Background preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buttons Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Square className="w-5 h-5 text-[#8129d9]" />
              <h3 className="text-lg text-black">Buttons</h3>
            </div>

            <div className="space-y-4">
              {/* Button Style */}
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">Button Style</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateButtons({ style: 'rounded' })}
                    className={`py-3 px-4 border-2 transition-all ${
                      config.buttons.style === 'rounded'
                        ? 'border-[#8129d9] bg-[#8129d9]/10 text-[#8129d9]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                    style={{ borderRadius: '8px' }}
                  >
                    Rounded
                  </button>
                  <button
                    onClick={() => updateButtons({ style: 'square' })}
                    className={`py-3 px-4 border-2 transition-all ${
                      config.buttons.style === 'square'
                        ? 'border-[#8129d9] bg-[#8129d9]/10 text-[#8129d9]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    Square
                  </button>
                  <button
                    onClick={() => updateButtons({ style: 'pill' })}
                    className={`py-3 px-4 border-2 transition-all ${
                      config.buttons.style === 'pill'
                        ? 'border-[#8129d9] bg-[#8129d9]/10 text-[#8129d9]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                    style={{ borderRadius: '50px' }}
                  >
                    Pill
                  </button>
                </div>
              </div>

              {/* Button Background Color */}
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">Button Background</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.buttons.backgroundColor}
                    onChange={(e) => updateButtons({ backgroundColor: e.target.value })}
                    className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200"
                  />
                  <input
                    type="text"
                    value={config.buttons.backgroundColor}
                    onChange={(e) => updateButtons({ backgroundColor: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#8129d9"
                  />
                </div>
              </div>

              {/* Button Text Color */}
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">Button Text Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.buttons.textColor}
                    onChange={(e) => updateButtons({ textColor: e.target.value })}
                    className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200"
                  />
                  <input
                    type="text"
                    value={config.buttons.textColor}
                    onChange={(e) => updateButtons({ textColor: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* Button Shadow */}
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-700">Button Shadow</Label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.buttons.hasShadow}
                    onChange={(e) => updateButtons({ hasShadow: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8129d9]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8129d9]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Fonts Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-[#8129d9]" />
              <h3 className="text-lg text-black">Fonts</h3>
            </div>

            <div className="space-y-4">
              {/* Heading Font */}
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">Heading Font</Label>
                <select
                  value={config.fonts.heading}
                  onChange={(e) => updateFonts({ heading: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  style={{ fontFamily: config.fonts.heading }}
                >
                  {GOOGLE_FONTS.map((font) => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </option>
                  ))}
                </select>
                <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <p className="text-lg" style={{ fontFamily: `${config.fonts.heading}, sans-serif` }}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              </div>

              {/* Body Font */}
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">Body Font</Label>
                <select
                  value={config.fonts.body}
                  onChange={(e) => updateFonts({ body: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  style={{ fontFamily: config.fonts.body }}
                >
                  {GOOGLE_FONTS.map((font) => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </option>
                  ))}
                </select>
                <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <p style={{ fontFamily: `${config.fonts.body}, sans-serif` }}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Colors Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-[#8129d9]" />
              <h3 className="text-lg text-black">Text Colors</h3>
            </div>

            <div className="space-y-4">
              {/* Username Color */}
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">Username Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.textColors.username}
                    onChange={(e) => updateTextColors({ username: e.target.value })}
                    className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200"
                  />
                  <input
                    type="text"
                    value={config.textColors.username}
                    onChange={(e) => updateTextColors({ username: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#000000"
                  />
                </div>
                <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <p style={{ color: config.textColors.username, fontFamily: `${config.fonts.heading}, sans-serif` }}>
                    @username
                  </p>
                </div>
              </div>

              {/* Description Color */}
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">Description Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.textColors.description}
                    onChange={(e) => updateTextColors({ description: e.target.value })}
                    className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200"
                  />
                  <input
                    type="text"
                    value={config.textColors.description}
                    onChange={(e) => updateTextColors({ description: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#676b5f"
                  />
                </div>
                <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <p style={{ color: config.textColors.description, fontFamily: `${config.fonts.body}, sans-serif` }}>
                    This is my bio description
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Tab */}
      {activeTab === 'template' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg text-black mb-4">Choose a Template</h3>
            <p className="text-sm text-gray-600 mb-6">
              Select a pre-designed template to quickly style your page. You can further customize it in the Design tab.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.map((template) => {
                const isSelected = selectedTemplate === template.id;
                
                return (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className={`group relative p-4 rounded-lg border-2 transition-all text-left hover:shadow-lg ${
                      isSelected
                        ? 'border-[#8129d9] shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Template Preview */}
                    <div 
                      className="w-full h-32 rounded-lg mb-3 relative overflow-hidden"
                      style={{
                        background: template.config.background.type === 'gradient'
                          ? `linear-gradient(to bottom, ${template.config.background.gradientStart}, ${template.config.background.gradientEnd})`
                          : template.config.background.solidColor
                      }}
                    >
                      {/* Mini button preview */}
                      <div className="absolute bottom-3 left-3 right-3 space-y-2">
                        <div
                          className="w-full h-8 flex items-center justify-center text-xs"
                          style={{
                            backgroundColor: template.config.buttons.backgroundColor,
                            color: template.config.buttons.textColor,
                            borderRadius: template.config.buttons.style === 'rounded' ? '6px' : template.config.buttons.style === 'square' ? '0px' : '20px',
                            boxShadow: template.config.buttons.hasShadow ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                          }}
                        >
                          Link
                        </div>
                      </div>

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#8129d9] text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <h4 className={`text-base mb-1 ${isSelected ? 'text-[#8129d9]' : 'text-black'}`}>
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>

                    {/* Color Palette */}
                    <div className="flex gap-1">
                      {template.preview.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}