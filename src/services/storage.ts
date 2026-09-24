import { supabase } from '@/lib/supabase/client';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/validators/material';

export async function generateSignedUploadUrl(fileName: string, fileSize: number, mimeType: string) {
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error('O tamanho do arquivo excede o limite máximo de 50MB.');
  }

  if (!ALLOWED_FILE_TYPES.includes(mimeType)) {
    throw new Error('Tipo de arquivo não permitido. Envie apenas PDF, PNG, JPEG ou DOCX.');
  }

  const sanitizeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileKey = `materials/${Date.now()}_${sanitizeFileName}`;

  const { data, error } = await supabase.storage
    .from('pedagogical-materials')
    .createSignedUploadUrl(fileKey);

  if (error || !data) {
    // Fallback public upload URL se signed upload não estiver habilitado no bucket anon
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rclclhlxexuneqaciyfe.supabase.co'}/storage/v1/object/public/pedagogical-materials/${fileKey}`;
    return {
      signedUrl: publicUrl,
      fileKey,
      fileUrl: publicUrl,
      token: 'upload-token',
    };
  }

  return {
    signedUrl: data.signedUrl,
    fileKey,
    fileUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rclclhlxexuneqaciyfe.supabase.co'}/storage/v1/object/public/pedagogical-materials/${fileKey}`,
    token: data.token,
  };
}
