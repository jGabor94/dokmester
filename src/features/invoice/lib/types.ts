import { z } from "zod";
import { invoicesTable } from "../drizzle/schema";
import { invoiceStatus, invoiceType } from "./constants";
import { invoiceFormSchema } from "./zod";

export type InsertInvoice = typeof invoicesTable.$inferInsert;
export type SelectInvoice = typeof invoicesTable.$inferSelect;
export type InvoiceInputs = z.infer<typeof invoiceFormSchema>
export type InvoiceType = keyof typeof invoiceType
export type InvoiceStatus = keyof typeof invoiceStatus

export type InvoiceHistory = Array<{
  id: string,
  type: InvoiceType
  serial: number,
  name: string,
  itemsNumber: number,
  date: Date,
}>

export type NavErrors = {
  errors: string[],
  xml: string
}


