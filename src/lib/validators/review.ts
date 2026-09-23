import { z } from 'zod';

export const reviewSchema = z.object({
  materialId: z.string().uuid(),
  status: z.enum(['APPROVED', 'NEEDS_REVISION', 'REJECTED'], {
    message: 'Selecione uma decisão de parecer válida.',
  }),
  feedback: z.string().optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
