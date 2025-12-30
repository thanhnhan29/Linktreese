// src/infrastructure/storage/fileImageStorage.ts
// Service to save images to local files via Vite dev server

export type ImageType = 'profile' | 'background';

interface UploadResponse {
  success: boolean;
  path?: string;
  fullPath?: string;
  error?: string;
}

interface CheckResponse {
  exists: boolean;
  path?: string;
}

/**
 * Upload an image to the local file system via Vite dev server
 * @param type - 'profile' or 'background'
 * @param key - Unique identifier (usually username)
 * @param dataUrl - Base64 data URL of the image
 * @returns The public URL path or null on failure
 */
export async function uploadImage(
  type: ImageType,
  key: string,
  dataUrl: string
): Promise<string | null> {
  console.log(`[FileStorage] uploadImage called - type: ${type}, key: ${key}, dataUrl length: ${dataUrl?.length || 0}`);
  
  try {
    // Use same-origin request to Vite dev server
    const response = await fetch('/__image-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, key, dataUrl }),
    });

    console.log(`[FileStorage] Upload response status: ${response.status}`);
    
    const data: UploadResponse = await response.json();
    console.log(`[FileStorage] Upload response data:`, data);
    
    if (data.success && data.path) {
      console.log(`[FileStorage] SUCCESS - Saved ${type} image for ${key}: ${data.path}`);
      return data.path;
    } else {
      console.error(`[FileStorage] Upload failed:`, data.error);
      return null;
    }
  } catch (error) {
    console.error(`[FileStorage] Upload error:`, error);
    return null;
  }
}

/**
 * Delete an image from the local file system
 */
export async function deleteImage(type: ImageType, key: string): Promise<boolean> {
  console.log(`[FileStorage] deleteImage called - type: ${type}, key: ${key}`);
  
  try {
    const response = await fetch('/__image-upload', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, key }),
    });

    const data = await response.json();
    console.log(`[FileStorage] Delete response:`, data);
    return data.success;
  } catch (error) {
    console.error(`[FileStorage] Delete error:`, error);
    return false;
  }
}

/**
 * Check if an image exists and get its path
 */
export async function getImagePath(type: ImageType, key: string): Promise<string | null> {
  console.log(`[FileStorage] getImagePath called - type: ${type}, key: ${key}`);
  
  try {
    const response = await fetch(`/__image-check/${type}/${key}`);
    console.log(`[FileStorage] Check response status: ${response.status}`);

    const data: CheckResponse = await response.json();
    console.log(`[FileStorage] Check response data:`, data);
    
    if (data.exists && data.path) {
      console.log(`[FileStorage] Image exists at: ${data.path}`);
      return data.path;
    }
    console.log(`[FileStorage] Image does not exist`);
    return null;
  } catch (error) {
    console.error(`[FileStorage] Could not check image:`, error);
    return null;
  }
}

/**
 * Validate image file
 */
export function validateImage(file: File, maxSizeMB: number = 2): { valid: boolean; error?: string } {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid image type. Please use JPG, PNG, GIF, or WebP.' };
  }

  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: `Image too large. Maximum size is ${maxSizeMB}MB.` };
  }

  return { valid: true };
}

/**
 * Convert File to base64 data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

