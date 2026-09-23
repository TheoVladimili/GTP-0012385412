import { materialSchema } from '@/lib/validators/material';

export async function submitMaterial(formData: {
  title: string;
  description: string;
  gradeYear: string;
  bnccCode: string;
  subjectId: string;
  fileUrl: string;
  fileKey: string;
  fileSize: number;
  fileMimeType: string;
  authorId: string;
}) {
  const validatedFields = materialSchema.parse({
    title: formData.title,
    description: formData.description,
    gradeYear: formData.gradeYear,
    bnccCode: formData.bnccCode,
    subjectId: formData.subjectId,
    fileUrl: formData.fileUrl,
    fileKey: formData.fileKey,
    fileSize: formData.fileSize,
    fileMimeType: formData.fileMimeType,
  });

  return { success: true, materialId: `mat-${Date.now()}`, data: validatedFields };
}

export async function updateMaterial(formData: {
  id: string;
  title?: string;
  description?: string;
  gradeYear?: string;
  bnccCode?: string;
  subjectId?: string;
  authorId: string;
}) {
  return { success: true, materialId: formData.id };
}
