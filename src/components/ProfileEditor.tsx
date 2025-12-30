import { useState, useEffect } from "react";
import { User, Camera, Sparkles, Check, X, Loader2 } from "lucide-react";
import ImageUploadModal from "./ImageUploadModal";
import { Button } from "./ui/button";
import { GoogleGenAI } from "@google/genai";

interface ProfileEditorProps {
  profileImage: string;
  bio: string;
  onUpdateProfile: (profileImage: string, bio: string) => void;
}

export default function ProfileEditor({
  profileImage,
  bio,
  onUpdateProfile,
}: ProfileEditorProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [localBio, setLocalBio] = useState(bio);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [previousBio, setPreviousBio] = useState<string>("");

  // Sync localBio with bio prop when it changes (e.g., when switching bio pages)
  useEffect(() => {
    setLocalBio(bio);
  }, [bio]);

  const handleBioChange = (value: string) => {
    setLocalBio(value);
    onUpdateProfile(profileImage, value);
  };

  const handleImageUpdate = (newImage: string) => {
    onUpdateProfile(newImage, localBio);
  };

  const generateAIBio = async () => {
    if (!localBio.trim()) {
      alert("Vui lòng nhập bio trước để AI có thể cải thiện!");
      return;
    }

    setIsGenerating(true);
    setPreviousBio(localBio);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        console.error("Missing VITE_GEMINI_API_KEY in environment.");
        alert(
          "AI key not configured. Please set VITE_GEMINI_API_KEY in your .env"
        );
        setIsGenerating(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: `Viết lại bio Linktree, tiếng Việt, hấp dẫn, cuốn hút người xem. Lưu ý: chỉ trả về đáp án được yêu cầu, không trả lời gì thêm: "${localBio}"`,
      });

      let generatedBio = response.text.trim();
      generatedBio = generatedBio.replace(/^[\"']|[\"']$/g, "");

      setAiSuggestion(generatedBio);
    } catch (error) {
      console.error("Error generating AI bio:", error);
      alert("Không thể tạo bio bằng AI. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRejectAI = () => {
    setAiSuggestion(null);
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
            <Button
              onClick={generateAIBio}
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

          {/* AI Suggestion Box */}
          {aiSuggestion && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-900">AI Suggestion</span>
                </div>
                <span className="text-xs text-gray-500">
                  {aiSuggestion.length} chars
                </span>
              </div>

              <div className="bg-white rounded-md p-3 mb-3">
                <p className="text-sm text-gray-800">{aiSuggestion}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAcceptAI}
                  size="sm"
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button
                  onClick={handleRejectAI}
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
          currentImage={profileImage}
          onClose={() => setShowUploadModal(false)}
          onImageUpdate={handleImageUpdate}
        />
      )}
    </div>
  );
}
