import { documentsTable } from "@/lib/drizzle/schema";
import { z } from "zod";
import { paymentMethods } from "../constants";
import { bidFormSchema, deliveryNoteSchema, DocumentItemSchema, invoiceFormSchema } from "../zod";

export type InsertDocument = typeof documentsTable.$inferInsert;
export type SelectDocument = typeof documentsTable.$inferSelect;

export type BidInputs = z.infer<typeof bidFormSchema>
export type DeliveryNoteInputs = z.infer<typeof deliveryNoteSchema>
export type InvoiceInputs = z.infer<typeof invoiceFormSchema>
export type DocumentItemInputs = z.infer<typeof DocumentItemSchema>

export type BidData = BidInputs
export type DeliveryNoteData = DeliveryNoteInputs
export type InvoiceData = InvoiceInputs & {
  invoiceType: InvoiceType,
  originalInvoice: string | null,
  history: Array<{
    id: string,
    type: InvoiceType
    serial: number,
    name: string,
    itemsNumber: number,
    date: Date,
  }>,
  nav?: {
    errors?: string[],
    xml?: string
  }
}

export type DocumentInputs = BidInputs | DeliveryNoteInputs | InvoiceInputs
export type DocumentData = BidData | DeliveryNoteData | InvoiceData

export type InvoiceType = "CREATE" | "MODIFY" | "STORNO"

/*
export type BidData = {
  issuer: {
    name: string,
    zip: number,
    city: string,
    address: string,
    taxnumber: string,
    email: string
  },
  applicant: Omit<DocumentInputs, "items">,
  items: DocumentInputs["items"],
}
*/

export type DocStatus = "aborted" | "validation" | "pending" | "sended" | "accepted"
export type DocType = "BID" | "DEN" | "CON" | "INV" | "CUS"

export type PaymentMethod = typeof paymentMethods[number];

export type DocumentItem = z.infer<typeof DocumentItemSchema>



/*
export type SzamlazzXmlData = {
  config: {
    id: string,
    eInvoice?: boolean,
    invoiceDownload?: boolean,
    responseVersion?: 1 | 2,
    aggregator?: string
  },
  header: {
    completionDate: string,
    dueDate: string,
    lang?: | "hu" | "en" | "de" | "it" | "ro" | "sk" | "hr" | "fr" | "es" | "cz" | "pl" | "bg" | "nl" | "ru" | "si",
    paymentMethod?: string,
    currency?: string,
    invoiceComment?: string,
    exchangeRateBank?: string,
    exchangeRate?: number,
    freeRequestAccountNumber?: string,
    advanceInvoice?: boolean,
    finalInvoice?: boolean
    correctionInvoice?: boolean,
    correctionInvoiceNumber?: string,
    freeRequest?: boolean,
    accountNumberPrefix?: string,
  },
  seller?: {
    bank?: string,
    bankAccountNumber?: string,
    emailReplyto?: string,
    emailSubject?: string,
    emailText?: string,
  },
  customer: {
    id?: string,
    name: string,
    zip: number,
    city: string,
    address: string,
    taxnumber?: string | null,
    email?: string | null,
    postalName?: string,
    postalZip?: number,
    postalCity?: string,
    postalAddress?: string,
    phoneNumber?: string | null,
    comment?: string,
    sendEmail?: boolean,
  },
  deliveryNote?: {
    destination?: string,
    courierService?: string,
  },
  items: (DocumentInputs["items"][0] & {
    comment?: string,
    vatAmount?: number | null,
    grossAmount?: number | null,
  })[]
}
  */