import { fileUploadSchema } from './validators';
import { SecurityErrors } from './errors';

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'application/pdf'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates a file before upload.
 */
export async function validateFile(file: File) {
  // 1. Basic Zod validation
  const validation = fileUploadSchema.safeParse({
    name: file.name,
    type: file.type,
    size: file.size,
  });

  if (!validation.success) {
    const errorMsg = validation.error.errors[0]?.message || 'Invalid file';
    throw SecurityErrors.invalidInput(errorMsg);
  }

  // 2. Extra extension check (defense in depth)
  const ext = file.name.split('.').pop()?.toLowerCase();
  const dangerousExtensions = ['html', 'svg', 'php', 'js', 'sh', 'exe'];
  
  if (ext && dangerousExtensions.includes(ext)) {
    throw SecurityErrors.invalidInput('Dangerous file extension detected');
  }

  return true;
}

/**
 * Generates a safe, unique filename to prevent path traversal and collisions.
 */
export function generateSafeFileName(originalName: string) {
  const ext = originalName.split('.').pop()?.toLowerCase() || '';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  // Clean original name (keep only alphanumeric and dashes)
  const cleanName = originalName
    .split('.')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .substring(0, 30);
    
  return `${cleanName}-${timestamp}-${random}.${ext}`;
}
