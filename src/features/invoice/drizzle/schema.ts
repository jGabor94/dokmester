import { companiesTable } from "@/features/company/drizzle/schema";
import { partnersTable } from "@/features/partners/drizzle/schema";
import { createdAt, updatedAt } from "@/lib/drizzle/schemaTypes";
import { relations } from "drizzle-orm";
import { integer, json, jsonb, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { InvoiceStatusEnum, invoiceTypeEnum, navStatusEnum } from "../lib/constants";
import { InvoiceHistory, InvoiceInputs, InvoiceStatus, NavErrors } from "../lib/types";


export const invoicesTable = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  data: json().$type<InvoiceInputs>().notNull(),
  size: integer('size').notNull(),
  fileName: varchar('file_name', { length: 100 }).notNull(),
  status: varchar('status', { enum: InvoiceStatusEnum }).$type<InvoiceStatus>().notNull(),
  transactionID: varchar('transaction_id', { length: 100 }).unique(),
  type: varchar('type', { enum: invoiceTypeEnum }).notNull(),
  history: jsonb("history").$type<InvoiceHistory>().notNull(),
  originalInvoice: uuid("original_invoice"),
  navStatus: varchar('nav_status', { enum: navStatusEnum }).notNull(),
  navErrors: json("nav_errors").$type<NavErrors>(),
  partnerID: uuid("partner_id").references(() => companiesTable.id, { onDelete: "cascade" }),
  companyID: uuid("company_id").references(() => companiesTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});





export const invoiceRelations = relations(invoicesTable, ({ one }) => ({
  company: one(companiesTable, {
    fields: [invoicesTable.companyID],
    references: [companiesTable.id],
  }),
  partner: one(partnersTable, {
    fields: [invoicesTable.companyID],
    references: [partnersTable.id],
  })
}))
