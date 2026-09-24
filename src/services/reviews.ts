import { supabase } from '@/lib/supabase/client';
import { reviewSchema } from '@/lib/validators/review';

export async function reviewMaterial(formData: {
  materialId: string;
  validatorId: string;
  status: string;
  feedback?: string;
}) {
  const validated = reviewSchema.parse({
    materialId: formData.materialId,
    status: formData.status,
    feedback: formData.feedback,
  });

  // Gravar a review no Supabase
  const { data: reviewData, error: reviewError } = await supabase
    .from('reviews')
    .insert([
      {
        materialId: validated.materialId,
        validatorId: formData.validatorId,
        status: validated.status,
        feedback: validated.feedback || null,
      },
    ])
    .select()
    .single();

  if (reviewError) {
    throw new Error(`Erro ao gravar parecer no Supabase: ${reviewError.message}`);
  }

  // Atualizar status do material
  const { error: materialError } = await supabase
    .from('materials')
    .update({ status: validated.status, updatedAt: new Date().toISOString() })
    .eq('id', validated.materialId);

  if (materialError) {
    throw new Error(`Erro ao atualizar status do material: ${materialError.message}`);
  }

  // Gravar log de auditoria
  await supabase.from('audit_logs').insert([
    {
      userId: formData.validatorId,
      action: `MATERIAL_${validated.status}`,
      targetId: validated.materialId,
      metadata: { feedback: validated.feedback },
    },
  ]);

  return { success: true, reviewId: reviewData.id };
}

export async function getPendingReviews() {
  const { data, error } = await supabase
    .from('materials')
    .select('*, subject:subjects(*), author:users(*)')
    .eq('status', 'SUBMITTED')
    .order('createdAt', { ascending: true });

  if (error) {
    console.error('Erro ao buscar fila de moderação:', error);
    return [];
  }
  return data || [];
}
