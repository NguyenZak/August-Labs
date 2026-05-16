import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/api-wrappers';
import { validateFile, generateSafeFileName } from '@/lib/upload';
import { uploadImage } from '@/app/actions/upload'; // Reusing existing Cloudinary logic but adding security
import { securityLog } from '@/lib/logger';
import { getServerSession } from '@/lib/auth';

/**
 * Secure API route for file uploads.
 * Restricted to Admins.
 */
async function uploadHandler(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const user = await getServerSession();

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Security Validation
    await validateFile(file);

    // 2. Logging the attempt
    await securityLog({
      action: 'FILE_UPLOAD_ATTEMPT',
      userId: user?.id,
      resourceType: 'FILE',
      resourceId: file.name,
      metadata: { size: file.size, type: file.type }
    });

    // 3. Process the upload
    // Note: uploadImage already uses Cloudinary and inserts into media_assets
    const url = await uploadImage(formData);

    return NextResponse.json({ url, success: true });
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

export const POST = withAdmin(uploadHandler, {
  rateLimitKey: 'upload_api',
  limit: 10,
  window: 60 * 10 // 10 uploads per 10 minutes per admin
});
