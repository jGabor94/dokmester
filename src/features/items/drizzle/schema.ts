import { companiesTable } from "@/features/company/drizzle/schema";
import { createdAt, updatedAt } from "@/lib/drizzle/schemaTypes";
import { relations } from "drizzle-orm";
import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { ItemType, VatKey } from "../utils/types";

export const itemsTable = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  companyID: uuid("company_id").references(() => companiesTable.id, { onDelete: "cascade" }).notNull(),
  unitPrice: integer("unit_price").notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  vatkey: varchar("vatkey", { length: 100 }).$type<VatKey>().notNull(),
  type: varchar("type", { length: 50 }).$type<ItemType>().notNull(),
  createdAt,
  updatedAt,
});

export const itemsRelations = relations(itemsTable, ({ one }) => ({
  company: one(companiesTable, {
    fields: [itemsTable.companyID],
    references: [companiesTable.id],
  }),
}));