import { DocumentItem, InvoiceType } from "@/features/documents/lib/types/document";
import { z } from "zod";
import { navDataTable } from "../drizzle/schema";
import { navDataFormSchema } from "./zodSchema";

export type InsertNavData = typeof navDataTable.$inferInsert;
export type SelectNavData = typeof navDataTable.$inferSelect;
export type NavDataInputs = z.infer<typeof navDataFormSchema>

export type InvoiceOperation = {
  operation: InvoiceType,
  data: string
}

export type InvoiceOperationData = {
  invoiceReference?: {
    originalInvoiceNumber: string,
    modificationIndex: number,
    itemsNumber: number,
  },
  serialNumber: string,
  supplier: {
    taxnumber: string,
    groupMemberTaxNumber?: string | null,
    communityVatNumber?: string | null,
    name: string,
    countryCode: string,
    zip: number,
    city: string,
    address: string,
    bankAccountNumber?: string | null
  },
  customer: {
    taxnumber?: string | null,
    groupMemberTaxNumber?: string | null,
    communityVatNumber?: string | null,
    name: string,
    countryCode: string,
    zip: number,
    city: string,
    address: string,
  }
  invoiceDetail: {
    category?: "NORMAL" | "SIMPLIFIED" | "AGGREGATE",
    deliveryDate?: string,
    invoiceDeliveryPeriodStart?: string,
    invoiceDeliveryPeriodEnd?: string,
    invoiceAccountingDeliveryDate?: string,
    periodicalSettlement?: boolean,
    smallBusinessIndicator?: boolean,
    currencyCode: string,
    exchangeRate: number,
    utilitySettlementIndicator?: boolean,
    selfBillingIndicator?: boolean,
    paymentMethod?: "TRANSFER" | "CASH" | "CARD" | "VOUCHER" | "OTHER",
    paymentDate?: string,
    cashAccountingIndicator?: boolean,
    invoiceAppearance?: "PAPER" | "ELECTRONIC" | "EDI" | "UNKNOWN",
    conventionalInvoiceInfo?: string,
    additionalInvoiceData?: string
  },
  lines: (DocumentItem & {
    intermediatedService?: boolean,
    aggregateData?: {
      exchnageRate: number,
      deliveryDate: string,
    },
  })[]
}
