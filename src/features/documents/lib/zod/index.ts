import { itemSchema } from '@/features/items/lib/zodSchema';
import { addressSchema, bankAccountNumberSchema, citySchema, communityVatNumberSchema, countryCodeSchema, currencySchema, emailSchema, exchangeRateSchema, groupMemberTaxNumberSchema, mobilSchema, nameSchema, taxnumberSchema, zipSchema } from '@/lib/zod/zodSchema';
import * as z from 'zod';

export const supplierSchema = z.object({
  name: nameSchema,
  taxnumber: taxnumberSchema,
  groupMemberTaxNumber: groupMemberTaxNumberSchema.optional().nullable(),
  communityVatNumber: communityVatNumberSchema.optional().nullable(),
  countryCode: countryCodeSchema,
  zip: zipSchema,
  city: citySchema,
  address: addressSchema,
  email: emailSchema,
  mobile: mobilSchema.optional().nullable(),
  bankAccountNumber: bankAccountNumberSchema.optional().nullable()
})

export const customerSchema = z.object({
  name: nameSchema,
  taxnumber: taxnumberSchema.optional().nullable(),
  groupMemberTaxNumber: groupMemberTaxNumberSchema.optional().nullable(),
  communityVatNumber: communityVatNumberSchema.optional().nullable(),
  countryCode: countryCodeSchema,
  zip: zipSchema,
  city: citySchema,
  address: addressSchema,
  email: emailSchema,
  mobile: mobilSchema.optional().nullable(),
})

export const DocumentItemSchema = itemSchema.extend({ quantity: z.coerce.number() })

export const bidFormSchema = z.object({
  type: z.literal("BID"),
  supplier: supplierSchema,
  customer: customerSchema,
  currency: currencySchema,
  exchangeRate: exchangeRateSchema,
  items: z.array(DocumentItemSchema).min(1)
}).superRefine((data, ctx) => {

  if (data.customer.taxnumber && data.customer.taxnumber.split("-")[1] === "5" && !data.customer.groupMemberTaxNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Csoporttag adószám kötelező csoportazonosító esetén",
      path: ["groupMemberTaxNumber"],
    });
  }
})

export const deliveryNoteSchema = z.object({
  type: z.literal("DEN"),
  supplier: supplierSchema,
  customer: customerSchema,
  currency: currencySchema,
  exchangeRate: exchangeRateSchema,
  items: z.array(DocumentItemSchema).min(1)
}).superRefine((data, ctx) => {

  if (data.customer.taxnumber && data.customer.taxnumber.split("-")[1] === "5" && !data.customer.groupMemberTaxNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Csoporttag adószám kötelező csoportazonosító esetén",
      path: ["groupMemberTaxNumber"],
    });
  }
})


