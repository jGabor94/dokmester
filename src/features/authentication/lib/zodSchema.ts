import { companyFormSchema } from '@/features/company/lib/zodSchema';
import { registerUserFormSchema } from '@/features/user/lib/zodSchema';
import * as z from 'zod';

export const registerFormSchema = z.object({
  company: companyFormSchema,
  user: registerUserFormSchema,
  customerID: z.string(),
  planID: z.string(),
  verified: z.boolean()
})

export const passwordResetSchema = z.object({
  email: z.string().email(),
})