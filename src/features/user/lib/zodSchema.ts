import { mobilSchema } from '@/lib/zod/zodSchema';
import * as z from 'zod';

export const editUserFormSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  mobile: mobilSchema,
});

const confirmPasswordBase = z.object({
  password: z.string().min(5),
  confirmPassword: z.string().min(5),
});

export const createDeleteAccountSchema = (correctValue: string) =>
  z.object({
    confirmMessage: z.string().refine((val) => val === correctValue, {
      message: `Az értéknek "${correctValue}"-nek kell lennie.`,
    }),
  });

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(5),
}).merge(confirmPasswordBase).superRefine((val, ctx) => {
  if (val.password !== val.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Megerősítő jelszó nem egyezik.',
      path: ['confirmPassword'],
    });
  }
});


export const confirmPasswordSchema = confirmPasswordBase.superRefine((val, ctx) => {
  if (val.password !== val.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Megerősítő jelszó nem egyezik.',
      path: ['confirmPassword'],
    });
  }
});

export const registerUserFormSchema = editUserFormSchema.merge(confirmPasswordBase).superRefine((val, ctx) => {
  if (val.password !== val.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Megerősítő jelszó nem egyezik.',
      path: ['confirmPassword'],
    });
  }
});


