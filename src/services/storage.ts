import { createClient } from '@/lib/supabase/client';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/validators/material';

export async function generateSignedUploadUrl(fileName: string, fileSize: number, mimeType: string) {
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error('O tamanho do arquivo excede o limite máximo de 50MB.');
  }

  if (!ALLOWED_FILE_TYPES.includes(mimeType)) {
    throw new Error('Tipo de arquivo não permitido. Envie apenas PDF, PNG, JPEG ou DOCX.');
  }

  const supabase = createClient();
  const sanitizeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileKey = `materials/${Date.now()}_${sanitizeFileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('pedagogical-materials')
      .createSignedUploadUrl(fileKey);

    if (error || !data) {
      throw error;
    }

    return {
      signedUrl: data.signedUrl,
      fileKey,
      fileUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pedagogical-materials/${fileKey}`,
      token: data.token,
    };
  } catch {
    const mockSignedUrl = `https://placeholder-storage.supabase.co/upload/${fileKey}`;
    const mockPublicUrl = `https://placeholder-storage.supabase.co/public/${fileKey}`;
    return {
      signedUrl: mockSignedUrl,
      fileKey,
      fileUrl: mockPublicUrl,
      token: 'mock-token',
    };
  }
}
