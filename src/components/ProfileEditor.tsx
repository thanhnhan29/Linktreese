import { useState, useEffect } from "react";
import { User, Camera, Sparkles, Check, X, Loader2, Wand2 } from "lucide-react";
import ImageUploadModal from "./ImageUploadModal";
import { Button } from "./ui/button";
import { useBioWriter } from "@/features/bio-page";
import type { BioStyle } from "@/features/bio-page";

interface ProfileEditorProps {
  profileImage: string;
  bio: string;
  onUpdateProfile: (profileImage: string, bio: string) => void;
}

const STYLE_OPTIONS: { value: BioStyle; label: string; icon: string }[] = [
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'creative', label: 'Creative', icon: '🎨' },
  { value: 'casual', label: 'Casual', icon: '😊' },
  { value: 'funny', label: 'Funny', icon: '😄' },
  { value: 'minimal', label: 'Minimal', icon: '✨' },
  { value: 'inspiring', label: 'Inspiring', icon: '🚀' },
];

export default function ProfileEditor({
  profileImage,
  bio,
  onUpdateProfile,
}: ProfileEditorProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [localBio, setLocalBio] = useState(bio);
  const [selectedStyle, setSelectedStyle] = useState<BioStyle>('professional');
  const [showStylePicker, setShowStylePicker] = useState(false);

  // Bio writer hook
  const { 
    isGenerating, 
    suggestion, 
    error: bioError,
    isAvailable,
    improveBio,
    clearSuggestion,
  } = useBioWriter();

  // Sync localBio with bio prop when it changes
  useEffect(() => {
    setLocalBio(bio);
  }, [bio]);

  const handleBioChange = (value: string) => {
    setLocalBio(value);
    onUpdateProfile(profileImage, value);
  };

  const handleImageUpdate = (newImage: string) => {
    console.log('[ProfileEditor] handleImageUpdate called, image length:', newImage?.length);
    console.log('[ProfileEditor] Calling onUpdateProfile...');
    onUpdateProfile(newImage, localBio);
    console.log('[ProfileEditor] onUpdateProfile called');
  };

  const handleGenerateBio = async () => {
    if (!localBio.trim()) {
      alert("Please enter a bio first for AI to improve!");
      return;
    }
    await improveBio(localBio, selectedStyle, 'en');
  };

  const handleAcceptSuggestion = () => {
    if (suggestion) {
      setLocalBio(suggestion);
      onUpdateProfile(profileImage, suggestion);
      clearSuggestion();
    }
  };

  const handleRejectSuggestion = () => {
    clearSuggestion();
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl mb-6">Profile</h2>

      <div className="flex gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div
            className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 cursor-pointer group"
            onClick={() => setShowUploadModal(true)}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Click to change
          </p>
        </div>

        {/* Bio */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm text-gray-700">Bio</label>
            {isAvailable && (
              <div className="flex items-center gap-2">
                {/* Style Picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowStylePicker(!showStylePicker)}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50"
                  >
                    <Wand2 className="w-3 h-3" />
                    {STYLE_OPTIONS.find(s => s.value === selectedStyle)?.icon}
                  </button>
                  
                  {showStylePicker && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2 min-w-[140px]">
                      {STYLE_OPTIONS.map((style) => (
                        <button
                          key={style.value}
                          onClick={() => {
                            setSelectedStyle(style.value);
                            setShowStylePicker(false);
                          }}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-gray-50 ${
                            selectedStyle === style.value ? 'bg-purple-50 text-purple-700' : ''
                          }`}
                        >
                          <span>{style.icon}</span>
                          <span>{style.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleGenerateBio}
                  disabled={isGenerating || !localBio.trim()}
                  size="sm"
                  variant="outline"
                  className="gap-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>AI Writer</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <textarea
            value={localBio}
            onChange={(e) => handleBioChange(e.target.value)}
            placeholder="Tell people about yourself..."
            className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">
            {localBio.length}/200 characters
          </p>

          {/* Error Message */}
          {bioError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-xs text-red-600">{bioError}</p>
            </div>
          )}

          {/* AI Suggestion Box */}
          {suggestion && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">AI Suggestion</span>
                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                    {STYLE_OPTIONS.find(s => s.value === selectedStyle)?.label}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {suggestion.length} chars
                </span>
              </div>

              <div className="bg-white rounded-md p-3 mb-3">
                <p className="text-sm text-gray-800">{suggestion}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAcceptSuggestion}
                  size="sm"
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button
                  onClick={handleRejectSuggestion}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Upload Modal */}
      {showUploadModal && (
        <ImageUploadModal
          currentImage={profileImage || ''}
          onClose={() => setShowUploadModal(false)}
          onImageUpdate={handleImageUpdate}
        />
      )}
    </div>
  );
}
