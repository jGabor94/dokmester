import * as z from 'zod';
import { invitesTable, usersTable } from "../drizzle/schema";
import { confirmPasswordSchema, createDeleteAccountSchema, editUserFormSchema, passwordChangeSchema, registerUserFormSchema } from "../lib/zodSchema";
import { getFullUser, getUserByEmail } from '../queries';

export interface UserDocument {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  password: string;
  companyID: string;
  role: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertInvite = typeof invitesTable.$inferInsert;
export type SelectInvite = typeof invitesTable.$inferSelect;
export type User = NonNullable<Awaited<ReturnType<typeof getUserByEmail>>>
export type FullUser = NonNullable<Awaited<ReturnType<typeof getFullUser>>>
export type RegisterUserInputs = z.infer<typeof registerUserFormSchema>
export type EditUserInputs = z.infer<typeof editUserFormSchema>
export type PasswordResetInputs = z.infer<typeof confirmPasswordSchema>
export type PasswordChangeInputs = z.infer<typeof passwordChangeSchema>
export type DeleteAccountSchema = z.infer<ReturnType<typeof createDeleteAccountSchema>>


