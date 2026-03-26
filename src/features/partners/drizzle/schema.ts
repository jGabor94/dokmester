import { companiesTable } from "@/features/company/drizzle/schema";
import { documentsTable } from "@/features/documents/drizzle/schema";
import { createdAt, updatedAt } from "@/lib/drizzle/schemaTypes";
import { CountryCode } from "@/types";
import { relations } from "drizzle-orm";
import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const partnersTable = pgTable("partners", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  taxnumber: varchar('tax_number', { length: 50 }),
  groupMemberTaxNumber: varchar('group_member_tax_number', { length: 13 }),
  communityVatNumber: varchar('community_vat_number', { length: 10 }),
  email: varchar('email', { length: 100 }).notNull(),
  mobile: varchar('mobile', { length: 100 }),
  countryCode: varchar('country_code', { length: 2 }).$type<CountryCode>().notNull(),
  zip: integer('zip').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  address: varchar('address', { length: 100 }).notNull(),
  companyID: uuid("company_id").references(() => companiesTable.id, { onDelete: "cascade" }).notNull(),
  createdAt,
  updatedAt,
});

export const partnersRelations = relations(partnersTable, ({ one, many }) => ({
  company: one(companiesTable, {
    fields: [partnersTable.companyID],
    references: [companiesTable.id],
  }),
  documents: many(documentsTable),
}));