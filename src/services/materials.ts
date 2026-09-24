import { supabase } from '@/lib/supabase/client';
import { materialSchema } from '@/lib/validators/material';

export async function getSubjects() {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Erro ao buscar disciplinas no Supabase:', error);
    return [];
  }
  return data || [];
}

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
  const validated = materialSchema.parse({
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

  const { data, error } = await supabase
    .from('materials')
    .insert([
      {
        title: validated.title,
        description: validated.description,
        gradeYear: validated.gradeYear,
        bnccCode: validated.bnccCode,
        subjectId: validated.subjectId,
        fileUrl: validated.fileUrl,
        fileKey: validated.fileKey,
        fileSize: validated.fileSize,
        fileMimeType: validated.fileMimeType,
        status: 'SUBMITTED',
        authorId: formData.authorId,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Falha ao salvar material no Supabase: ${error.message}`);
  }

  // Registrar Log de Auditoria
  await supabase.from('audit_logs').insert([
    {
      userId: formData.authorId,
      action: 'MATERIAL_SUBMITTED',
      targetId: data.id,
      metadata: { title: data.title, bnccCode: data.bnccCode },
    },
  ]);

  return { success: true, materialId: data.id };
}

export async function getApprovedMaterials() {
  const { data, error } = await supabase
    .from('materials')
    .select('*, subject:subjects(*), author:users(*)')
    .eq('status', 'APPROVED')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Erro ao buscar materiais aprovados:', error);
    return [];
  }
  return data || [];
}

export async function getTeacherMaterials(authorId: string) {
  const { data, error } = await supabase
    .from('materials')
    .select('*, subject:subjects(*), reviews(*)')
    .eq('authorId', authorId)
    .order('updatedAt', { ascending: false });

  if (error) {
    console.error('Erro ao buscar materiais do professor:', error);
    return [];
  }
  return data || [];
}
