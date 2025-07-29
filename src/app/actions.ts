'use server';

import { createAdminClient } from '@/lib/supabase/server';

/**
 * Securely uploads a file to a specified Supabase Storage bucket.
 * This function runs on the server and uses the service_role key to bypass RLS.
 *
 * @param bucketName The name of the storage bucket ('avatars', 'identity_documents', or 'property_images').
 * @param userId The ID of the user, used to create a folder path.
 * @param formData The FormData object containing the file to upload.
 * @returns An object with either the publicUrl or an error message.
 */
export async function uploadFile(
  bucketName: 'avatars' | 'identity_documents' | 'property_images',
  userId: string,
  formData: FormData
): Promise<{ publicUrl: string } | { error: string }> {
  try {
    const file = formData.get('file') as File;
    if (!file || file.size === 0) {
      return { error: 'No file provided or file is empty.' };
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { error: 'File size must be less than 10MB.' };
    }

    // Validate file type for identity documents and property images
    if (bucketName === 'identity_documents' || bucketName === 'property_images') {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        const fileTypeDescription = bucketName === 'identity_documents' ? 'identity documents' : 'property images';
        return { error: `Only JPEG, PNG, and WebP images are allowed for ${fileTypeDescription}.` };
      }
    }

    const supabase = createAdminClient();
    const filePath = `${userId}/${Date.now()}_${file.name}`;

    console.log(`Uploading file to bucket: ${bucketName}, path: ${filePath}`);

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Server-side Upload Error:', uploadError);
      
      // Provide more specific error messages
      if (uploadError.message.includes('Bucket not found')) {
        return { error: `Storage bucket '${bucketName}' not found. Please contact support.` };
      }
      if (uploadError.message.includes('The resource already exists')) {
        return { error: 'A file with this name already exists. Please try again.' };
      }
      
      return { error: `Failed to upload file: ${uploadError.message}` };
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    console.log(`File uploaded successfully: ${data.publicUrl}`);
    
    return { publicUrl: data.publicUrl };
  } catch (error: any) {
    console.error('Unexpected error in uploadFile:', error);
    return { error: 'An unexpected error occurred during file upload. Please try again.' };
  }
}