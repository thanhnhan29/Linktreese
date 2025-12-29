import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import ImageCropModal from './ImageCropModal';

interface ImageUploadModalProps {
  currentImage: string;
  onClose: () => void;
  onImageUpdate: (image: string) => void;
}

export default function ImageUploadModal({ currentImage, onClose, onImageUpdate }: ImageUploadModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>(currentImage);
  const [showCropModal, setShowCropModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
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
    onImageUpdate(croppedImage);
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
          <h2 className="text-xl">Upload Profile Image</h2>
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
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedImage ? (
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
            />
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Recommended: Square image, at least 400x400px
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleOk}
            disabled={!selectedImage}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
