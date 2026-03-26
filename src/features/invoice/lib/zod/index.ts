import { customerSchema, DocumentItemSchema, supplierSchema } from "@/features/documents/lib/zod";
import { currencySchema, exchangeRateSchema, paymentMethodSchema } from "@/lib/zod/zodSchema";
import { z } from "zod";

export const invoiceFormSchema = z.object({
  supplier: supplierSchema,
  customer: customerSchema,
  completionDate: z.string({ required_error: "Teljesítés dátum megadása kötelező!" }).date("Helytleen teljesítés dátum!"),
  dueDate: z.string({ required_error: "Fizetési határidő megadása kötelező!" }).date("Helytelen fizetési határidő!"),
  paymentMethod: paymentMethodSchema,
  currency: currencySchema,
  exchangeRate: exchangeRateSchema,
  items: z.array(DocumentItemSchema),
  comment: z.string().optional().nullable(),
}).superRefine((data, ctx) => {

  if (data.customer.taxnumber && data.customer.taxnumber.split("-")[1] === "5" && !data.customer.groupMemberTaxNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Csoporttag adószám kötelező csoportazonosító esetén",
      path: ["groupMemberTaxNumber"],
    });
  }

  data.items.forEach((item, index) => {

    if ((item.vatkey === "KBAET" || item.vatkey === "KBAUK") && !data.supplier.communityVatNumber) ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "KBAET | KBAUK  esetén érvényes közösségi adószám megadása kötelező az eladónak!",
      path: ["supplier", "communityVatNumber"],
    });

    if ((item.vatkey === "KBAET" || item.vatkey === "KBAUK") && !data.customer.communityVatNumber) ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "KBAET | KBAUK  esetén érvényes közösségi adószám megadása kötelező a vevőnek!",
      path: ["customer", "communityVatNumber"],
    });


    if ((item.vatkey === "KBAET" ||
      item.vatkey === "KBAUK"
    ) && item.type === "SERVICE") ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "KBAET | KBAUK áfakulcs csak termékekre alkalmazható!",
      path: [`items`, index, "type"],
    });

    if ((item.vatkey === "ATK" ||
      item.vatkey === "EUFAD37" ||
      item.vatkey === "EUFADE" ||
      item.vatkey === "EUE" ||
      item.vatkey === "HO"
    ) && item.type === "PRODUCT") ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "ATK | EUFAD37 | EUFADE | EUE | HO áfakulcs csak szolgáltatásokra alkalmazható!",
      path: [`items`, index, "type"],
    });

    if (item.vatkey === "F.AFA" && !data.customer.taxnumber) ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "F.AFA esetén érvényes magyar adószám megadása kötelező a vevőnek mivel ez az áfakulcs csak belföldi adóalanonyknak való értékéesítés esetén használható!",
      path: ["customer", "taxnumber"],
    });

    if ((item.vatkey === "EUFAD37" || item.vatkey === "EUFADE" || item.vatkey === "EUE") && !data.supplier.communityVatNumber) ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "EUFAD37 | EUFADE | EUE esetén érvényes közösségi adószám megadása kötelező az eladónak!",
      path: ["supplier", "taxnumber"],
    });

    if ((item.vatkey === "EUFAD37" || item.vatkey === "EUFADE" || item.vatkey === "EUE") && !data.customer.communityVatNumber) ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "EUFAD37 | EUFADE | EUE esetén érvényes közösségi adószám megadása kötelező a vevőnek!",
      path: ["customer", "taxnumber"],
    });

  })
});