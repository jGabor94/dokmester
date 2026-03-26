import { bankAccountNumberSchema, communityVatNumberSchema, countryCodeSchema, groupMemberTaxNumberSchema, taxnumberSchema } from '@/lib/zod/zodSchema';
import * as z from 'zod';

export const companyFormSchema = z.object({
  name: z.string().min(3),
  taxnumber: taxnumberSchema,
  groupMemberTaxNumber: groupMemberTaxNumberSchema.optional(),
  communityVatNumber: communityVatNumberSchema.optional(),
  countryCode: countryCodeSchema,
  zip: z.coerce.number().int().gte(1000).lte(9999),
  city: z.string().min(2),
  address: z.string().min(3),
  bankAccountNumber: bankAccountNumberSchema.optional().nullable(),
  color: z.string(),
  monogram: z.string().max(3).nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.taxnumber.split("-")[1] === "5" && !data.groupMemberTaxNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Csoporttag adószám kötelező csoportazonosító esetén",
      path: ["groupMemberTaxNumber"],
    });
  }
});

export const createCompanyFormSchema = z.object({
  company: companyFormSchema,
  customerID: z.string(),
  planID: z.string(),
})

export const inviteFormSchema = z.object({
  email: z.string().email(),
})





