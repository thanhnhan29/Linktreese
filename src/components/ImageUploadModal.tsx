import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import ImageCropModal from './ImageCropModal';
import { toast } from 'sonner';

interface ImageUploadModalProps {
  currentImage: string;
  onClose: () => void;
  onImageUpdate: (image: string) => void;
}

export default function ImageUploadModal({ 
  currentImage, 
  onClose, 
  onImageUpdate,
}: ImageUploadModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>(currentImage);
  const [showCropModal, setShowCropModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const validateImage = (file: File): { valid: boolean; error?: string } => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid image type. Please use JPG, PNG, GIF, or WebP.' };
    }
    if (file.size > 2 * 1024 * 1024) {
      return { valid: false, error: 'Image too large. Maximum size is 2MB.' };
    }
    return { valid: true };
  };

  const handleFileSelect = (file: File) => {
    const validation = validateImage(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleOk = () => {
    if (selectedImage) {
      setShowCropModal(true);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    console.log('[ImageUploadModal] handleCropComplete called, image length:', croppedImage?.length);
    setUploading(true);
    
    // Pass the cropped image data URL to parent
    console.log('[ImageUploadModal] Calling onImageUpdate...');
    onImageUpdate(croppedImage);
    console.log('[ImageUploadModal] onImageUpdate called successfully');
    toast.success('Image updated!');
    
    setUploading(false);
    setShowCropModal(false);
    onClose();
  };

  if (showCropModal) {
    return (
      <ImageCropModal
        image={selectedImage}
        onClose={() => setShowCropModal(false)}
        onCropComplete={handleCropComplete}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl">Upload Image</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="space-y-4">
                <div className="w-full h-[300px] bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-600 mx-auto animate-spin mb-3" />
                    <p className="text-gray-600">Processing...</p>
                  </div>
                </div>
              </div>
            ) : selectedImage ? (
              <div className="space-y-4">
                <div className="relative w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <button
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="text-purple-600 hover:underline text-sm"
                >
                  Choose a different image
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-full h-[300px] bg-gray-50 rounded-lg flex items-center justify-center">
                  <Upload className="w-16 h-16 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag and drop your image here, or
                  </p>
                  <button
                    onClick={() => document.getElementById('file-input')?.click()}
                    className="text-purple-600 hover:underline"
                  >
                    browse to choose a file
                  </button>
                </div>
              </div>
            )}
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              disabled={uploading}
            />
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Recommended: Square image, at least 400x400px. Max size: 2MB
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleOk}
            disabled={!selectedImage || uploading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {uploading ? 'Processing...' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
}
