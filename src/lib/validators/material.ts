import { z } from 'zod';

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB em bytes

export const materialSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'O título deve ter no mínimo 5 caracteres.' })
    .max(120, { message: 'O título deve ter no máximo 120 caracteres.' }),
  description: z
    .string()
    .min(10, { message: 'A descrição deve ter no mínimo 10 caracteres.' })
    .max(2000, { message: 'A descrição deve ter no máximo 2000 caracteres.' }),
  gradeYear: z.enum(['YEAR_1', 'YEAR_2', 'YEAR_3', 'YEAR_4', 'YEAR_5'], {
    message: 'Selecione um ano escolar válido.',
  }),
  bnccCode: z
    .string()
    .min(5, { message: 'Informe um código BNCC válido (ex: EF01LP01).' })
    .regex(/^EF[0-9]{2}[A-Z]{2}[0-9]{2}$/, {
      message: 'Código BNCC com formato inválido (ex: EF01LP01).',
    }),
  subjectId: z.string().uuid({ message: 'Selecione uma disciplina válida.' }),
  fileUrl: z.string().url({ message: 'URL do arquivo inválida.' }),
  fileKey: z.string().min(1, { message: 'Chave do arquivo obrigatória.' }),
  fileSize: z
    .number()
    .max(MAX_FILE_SIZE, { message: 'O arquivo não pode exceder 50MB.' }),
  fileMimeType: z.string().refine((type) => ALLOWED_FILE_TYPES.includes(type), {
    message: 'Formato de arquivo não suportado. Envie PDF, PNG, JPEG ou DOCX.',
  }),
});

export const updateMaterialSchema = materialSchema.partial().extend({
  id: z.string().uuid(),
});

export type MaterialInput = z.infer<typeof materialSchema>;
export type UpdateMaterialInput = z.infer<typeof updateMaterialSchema>;
