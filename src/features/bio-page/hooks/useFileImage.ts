// src/features/bio-page/hooks/useFileImage.ts
// Hook for saving images to local files

import { useState, useCallback, useEffect } from 'react';
import { 
  uploadImage, 
  deleteImage, 
  getImagePath,
  validateImage,
  fileToDataUrl,
  type ImageType 
} from '@/infrastructure/storage/fileImageStorage';

interface UseFileImageOptions {
  key: string; // Unique key (e.g., username)
  imageType: ImageType;
}

interface UseFileImageReturn {
  imagePath: string | null;
  loading: boolean;
  error: string | null;
  uploadFromFile: (file: File) => Promise<string | null>;
  uploadFromDataUrl: (dataUrl: string) => Promise<string | null>;
  deleteCurrentImage: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook to manage file-based image storage
 */
export function useFileImage({ key, imageType }: UseFileImageOptions): UseFileImageReturn {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(`[useFileImage] Hook initialized - key: ${key}, imageType: ${imageType}`);

  // Load existing image on mount
  const refresh = useCallback(async () => {
    console.log(`[useFileImage] refresh called - key: ${key}`);
    
    if (!key) {
      console.log(`[useFileImage] No key, skipping refresh`);
      setLoading(false);
      return;
    }

    try {
      const path = await getImagePath(imageType, key);
      console.log(`[useFileImage] getImagePath returned: ${path}`);
      setImagePath(path);
    } catch (err) {
      console.warn('[useFileImage] Could not load image path:', err);
    } finally {
      setLoading(false);
    }
  }, [key, imageType]);

  useEffect(() => {
    console.log(`[useFileImage] useEffect triggered, calling refresh`);
    refresh();
  }, [refresh]);

  const uploadFromDataUrl = useCallback(async (dataUrl: string): Promise<string | null> => {
    console.log(`[useFileImage] uploadFromDataUrl called - key: ${key}, dataUrl length: ${dataUrl?.length || 0}`);
    
    if (!key) {
      console.error(`[useFileImage] No key provided for upload`);
      setError('No key provided');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const path = await uploadImage(imageType, key, dataUrl);
      console.log(`[useFileImage] uploadImage returned: ${path}`);
      
      if (path) {
        // Add cache-busting query param
        const pathWithCacheBust = `${path}?t=${Date.now()}`;
        console.log(`[useFileImage] Setting imagePath to: ${pathWithCacheBust}`);
        setImagePath(pathWithCacheBust);
        return pathWithCacheBust;
      } else {
        console.error(`[useFileImage] Upload failed - no path returned`);
        setError('Failed to upload image');
        return null;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      console.error(`[useFileImage] Upload error:`, err);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [key, imageType]);

  const uploadFromFile = useCallback(async (file: File): Promise<string | null> => {
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid image');
      return null;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      return await uploadFromDataUrl(dataUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to read file';
      setError(message);
      return null;
    }
  }, [uploadFromDataUrl]);

  const deleteCurrentImage = useCallback(async () => {
    if (!key) return;

    try {
      await deleteImage(imageType, key);
      setImagePath(null);
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  }, [key, imageType]);

  return {
    imagePath,
    loading,
    error,
    uploadFromFile,
    uploadFromDataUrl,
    deleteCurrentImage,
    refresh,
  };
}

