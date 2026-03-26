import { companiesTable } from "@/features/company/drizzle/schema";
import { partnersTable } from "@/features/partners/drizzle/schema";
import { createdAt, updatedAt } from "@/lib/drizzle/schemaTypes";
import { relations } from "drizzle-orm";
import { integer, json, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { DocStatus, DocumentData } from "../lib/types/document";

export const documentsTable = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  file: varchar('file', { length: 100 }).unique().notNull(),
  data: json().$type<DocumentData>().notNull(),
  size: integer('size').notNull(),
  state: varchar('state', { enum: ["aborted", "validation", "pending", "sended", "accepted"] }).$type<DocStatus>().notNull(),
  transactionID: varchar('transaction_id', { length: 100 }).unique(),
  partnerID: uuid("partner_id").references(() => companiesTable.id, { onDelete: "cascade" }),
  companyID: uuid("company_id").references(() => companiesTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});



export const documentsRelations = relations(documentsTable, ({ one }) => ({
  company: one(companiesTable, {
    fields: [documentsTable.companyID],
    references: [companiesTable.id],
  }),
  partner: one(partnersTable, {
    fields: [documentsTable.companyID],
    references: [partnersTable.id],
  })
}))
