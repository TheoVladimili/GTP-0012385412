import { reviewSchema } from '@/lib/validators/review';

export async function reviewMaterial(formData: {
  materialId: string;
  validatorId: string;
  status: string;
  feedback?: string;
}) {
  const validatedFields = reviewSchema.parse({
    materialId: formData.materialId,
    status: formData.status,
    feedback: formData.feedback,
  });

  return { success: true, reviewId: `rev-${Date.now()}`, data: validatedFields };
}
