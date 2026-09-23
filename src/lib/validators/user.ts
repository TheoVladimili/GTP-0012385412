import { z } from 'zod';

export const OFFICIAL_DOMAIN = '@francodarocha.sp.gov.br';
export const OFFICIAL_EDU_DOMAIN = '@educa.francodarocha.sp.gov.br';

export const userLoginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Informe um endereço de e-mail válido.' })
    .toLowerCase(),
});

export const preApprovalSchema = z.object({
  email: z
    .string()
    .email({ message: 'Informe um endereço de e-mail válido.' })
    .toLowerCase(),
  name: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }),
  role: z.enum(['TEACHER', 'VALIDATOR', 'ADMIN']),
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type PreApprovalInput = z.infer<typeof preApprovalSchema>;
