import * as z from 'zod';
import { comapniesMetaTable, companiesTable } from "../drizzle/schema";
import { companyFormSchema, createCompanyFormSchema, inviteFormSchema } from "../lib/zodSchema";
import { getFullCompany } from "../queries/getCompany";

export type InsertCompany = typeof companiesTable.$inferInsert;
export type SelectCompany = typeof companiesTable.$inferSelect;
export type InsertCompanyMeta = typeof comapniesMetaTable.$inferInsert;
export type SelectCompanyMeta = typeof comapniesMetaTable.$inferSelect;
export type FullCompany = NonNullable<Awaited<ReturnType<typeof getFullCompany>>>
export type CompanyInputs = z.infer<typeof companyFormSchema>
export type InviteInputs = z.infer<typeof inviteFormSchema>
export type CreateCompanyForm = z.infer<typeof createCompanyFormSchema>

