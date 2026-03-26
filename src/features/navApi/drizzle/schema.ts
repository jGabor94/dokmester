import { companiesTable } from "@/lib/drizzle/schema";
import { createdAt, updatedAt } from "@/lib/drizzle/schemaTypes";
import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const navDataTable = pgTable("nav_data", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  userName: varchar('user_name', { length: 15 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  signatureKey: varchar('signature_key', { length: 255 }).notNull(),
  exchangeKey: varchar('exchange_key', { length: 255 }).notNull(),
  companyID: uuid("company_id").references(() => companiesTable.id, { onDelete: "cascade" }).notNull(),
  createdAt,
  updatedAt,
});

export const navDataRelations = relations(navDataTable, ({ one }) => ({
  company: one(companiesTable, {
    fields: [navDataTable.companyID],
    references: [companiesTable.id],
  }),
}));