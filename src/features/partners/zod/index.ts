import { communityVatNumberSchema, countryCodeSchema, groupMemberTaxNumberSchema, taxnumberSchema, zipSchema } from "@/lib/zod/zodSchema";
import { z } from "zod";

export const PartnerFormSchema = z.object({
  name: z.string().min(3),
  taxnumber: taxnumberSchema.nullable(),
  groupMemberTaxNumber: groupMemberTaxNumberSchema.optional().nullable(),
  communityVatNumber: communityVatNumberSchema.optional().nullable(),
  countryCode: countryCodeSchema,
  zip: zipSchema,
  city: z.string().min(2),
  address: z.string().min(3),
  email: z.string().email(),
  mobile: z.string().optional().nullable(),
})