// vite-plugin-image-upload.ts
// Vite plugin to handle image uploads during development
// This eliminates the need for a separate upload server

import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

interface UploadBody {
  type: 'profile' | 'background';
  key: string;
  dataUrl: string;
}

interface DeleteBody {
  type: 'profile' | 'background';
  key: string;
}

export function imageUploadPlugin(): Plugin {
  const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads');
  const PROFILES_DIR = path.join(UPLOAD_DIR, 'profiles');
  const BACKGROUNDS_DIR = path.join(UPLOAD_DIR, 'backgrounds');

  // Ensure directories exist
  const ensureDirs = () => {
    [UPLOAD_DIR, PROFILES_DIR, BACKGROUNDS_DIR].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`[ImageUpload] Created directory: ${dir}`);
      }
    });
  };

  return {
    name: 'vite-plugin-image-upload',
    
    configureServer(server) {
      ensureDirs();
      console.log(`[ImageUpload] Plugin initialized. Upload directory: ${UPLOAD_DIR}`);

      // Handle image upload
      server.middlewares.use('/__image-upload', async (req, res) => {
        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 204;
          res.end();
          return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // POST - Upload image
        if (req.method === 'POST') {
          let body = '';
          
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });

          req.on('end', () => {
            try {
              const { type, key, dataUrl } = JSON.parse(body) as UploadBody;
              console.log(`[ImageUpload] Upload request - type: ${type}, key: ${key}`);

              if (!type || !key || !dataUrl) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'Missing required fields' }));
                return;
              }

              if (!dataUrl.startsWith('data:image/')) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'Invalid image data' }));
                return;
              }

              // Extract format and base64 data
              const matches = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
              if (!matches) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'Invalid data URL format' }));
                return;
              }

              const format = matches[1] === 'jpeg' ? 'jpg' : matches[1];
              const base64Data = matches[2];
              const buffer = Buffer.from(base64Data, 'base64');

              // Determine directory and filename
              const dir = type === 'profile' ? PROFILES_DIR : BACKGROUNDS_DIR;
              const filename = `${key}.${format}`;
              const filepath = path.join(dir, filename);

              // Delete any existing file with different extension
              const files = fs.readdirSync(dir);
              files.forEach(f => {
                if (f.startsWith(key + '.') && f !== filename) {
                  fs.unlinkSync(path.join(dir, f));
                  console.log(`[ImageUpload] Deleted old file: ${f}`);
                }
              });

              // Save file
              fs.writeFileSync(filepath, buffer);
              
              const publicPath = `/uploads/${type === 'profile' ? 'profiles' : 'backgrounds'}/${filename}`;
              console.log(`[ImageUpload] Saved: ${filepath} -> ${publicPath}`);

              res.statusCode = 200;
              res.end(JSON.stringify({ 
                success: true, 
                path: publicPath,
                fullPath: filepath 
              }));

            } catch (error) {
              console.error('[ImageUpload] Upload error:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: 'Failed to save image' }));
            }
          });

          return;
        }

        // DELETE - Remove image
        if (req.method === 'DELETE') {
          let body = '';
          
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });

          req.on('end', () => {
            try {
              const { type, key } = JSON.parse(body) as DeleteBody;
              console.log(`[ImageUpload] Delete request - type: ${type}, key: ${key}`);

              if (!type || !key) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'Missing required fields' }));
                return;
              }

              const dir = type === 'profile' ? PROFILES_DIR : BACKGROUNDS_DIR;
              const files = fs.readdirSync(dir);
              const matchingFile = files.find(f => f.startsWith(key + '.'));

              if (matchingFile) {
                fs.unlinkSync(path.join(dir, matchingFile));
                console.log(`[ImageUpload] Deleted: ${matchingFile}`);
              }

              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));

            } catch (error) {
              console.error('[ImageUpload] Delete error:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: 'Failed to delete image' }));
            }
          });

          return;
        }

        res.statusCode = 405;
        res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
      });

      // Handle image check
      server.middlewares.use('/__image-check', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');

        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
          return;
        }

        try {
          // Parse URL: /__image-check/profile/username
          const urlParts = req.url?.split('/').filter(Boolean) || [];
          const type = urlParts[0] as 'profile' | 'background';
          const key = urlParts[1];

          console.log(`[ImageUpload] Check request - type: ${type}, key: ${key}`);

          if (!type || !key) {
            res.statusCode = 400;
            res.end(JSON.stringify({ exists: false, error: 'Missing type or key' }));
            return;
          }

          const dir = type === 'profile' ? PROFILES_DIR : BACKGROUNDS_DIR;
          
          if (!fs.existsSync(dir)) {
            res.statusCode = 200;
            res.end(JSON.stringify({ exists: false }));
            return;
          }

          const files = fs.readdirSync(dir);
          const matchingFile = files.find(f => f.startsWith(key + '.'));

          if (matchingFile) {
            const publicPath = `/uploads/${type === 'profile' ? 'profiles' : 'backgrounds'}/${matchingFile}`;
            console.log(`[ImageUpload] Found: ${publicPath}`);
            res.statusCode = 200;
            res.end(JSON.stringify({ exists: true, path: publicPath }));
          } else {
            console.log(`[ImageUpload] Not found for key: ${key}`);
            res.statusCode = 200;
            res.end(JSON.stringify({ exists: false }));
          }

        } catch (error) {
          console.error('[ImageUpload] Check error:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ exists: false, error: 'Failed to check image' }));
        }
      });
    },
  };
}

