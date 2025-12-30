import { useState, useCallback } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import Cropper, { Point, Area } from 'react-easy-crop';

interface ImageCropModalProps {
  image: string;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
}

export default function ImageCropModal({ image, onClose, onCropComplete }: ImageCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) {
      console.error('[ImageCropModal] No cropped area pixels');
      return;
    }

    try {
      console.log('[ImageCropModal] Creating cropped image from:', image.substring(0, 50));
      
      const canvas = document.createElement('canvas');
      const imageElement = new Image();
      
      // Handle CORS for images
      imageElement.crossOrigin = 'anonymous';
      imageElement.src = image;

      await new Promise((resolve, reject) => {
        imageElement.onload = resolve;
        imageElement.onerror = reject;
      });

      console.log('[ImageCropModal] Image loaded, size:', imageElement.width, 'x', imageElement.height);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('[ImageCropModal] Failed to get canvas context');
        return;
      }

      // Set canvas size to the cropped area
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      console.log('[ImageCropModal] Cropping to:', croppedAreaPixels);

      // Draw the cropped image
      ctx.drawImage(
        imageElement,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Convert to base64 data URL and return
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      console.log('[ImageCropModal] Created cropped image, length:', dataUrl.length);
      
      if (dataUrl.length < 100) {
        console.error('[ImageCropModal] Generated image is too small, something went wrong');
        return;
      }
      
      onCropComplete(dataUrl);
    } catch (error) {
      console.error('[ImageCropModal] Error cropping image:', error);
    }
  };

  const handleSubmit = async () => {
    await createCroppedImage();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[700px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl">Crop Image</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative w-full h-[500px] bg-gray-900">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
          />
        </div>

        {/* Zoom Controls */}
        <div className="p-6 border-t">
          <div className="flex items-center gap-4">
            <ZoomOut className="w-5 h-5 text-gray-600" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
            <ZoomIn className="w-5 h-5 text-gray-600" />
          </div>
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
            onClick={handleSubmit}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}