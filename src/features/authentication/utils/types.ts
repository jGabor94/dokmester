import * as z from 'zod';
import { passwordResetSchema, registerFormSchema } from '../lib/zodSchema';

export type RegisterForm = z.infer<typeof registerFormSchema>
export type PasswordResetForm = z.infer<typeof passwordResetSchema>
