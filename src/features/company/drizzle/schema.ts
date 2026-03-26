import { documentsTable } from "@/features/documents/drizzle/schema";
import { itemsTable } from "@/features/items/drizzle/schema";
import { navDataTable } from "@/features/navApi/drizzle/schema";
import { partnersTable } from "@/features/partners/drizzle/schema";
import { invitesTable, usersTable } from "@/features/user/drizzle/schema";
import { subscriptionsTable } from "@/lib/drizzle/schema";
import { createdAt, updatedAt } from "@/lib/drizzle/schemaTypes";
import { CountryCode } from "@/types";
import { relations, sql } from "drizzle-orm";
import { integer, pgTable, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const companiesTable = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  taxnumber: varchar('tax_number', { length: 13 }).notNull(),
  groupMemberTaxNumber: varchar('group_member_tax_number', { length: 13 }),
  communityVatNumber: varchar('community_vat_number', { length: 10 }),
  countryCode: varchar('country_code', { length: 2 }).$type<CountryCode>().notNull(),
  zip: integer('zip').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  address: varchar('address', { length: 100 }).notNull(),
  bankAccountNumber: varchar('bank_account_number', { length: 26 }),
  accountProvider: varchar('account_provider', { length: 100 }),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  logo: varchar('logo', { length: 100 }).default("default").notNull(),
  color: varchar('color', { length: 100 }),
  monogram: varchar('monogram', { length: 3 }),
  createdAt,
  updatedAt,
});

export const companiesRelations = relations(companiesTable, ({ one, many }) => ({
  users: many(userToCompanyTable, { relationName: "company_user" }),
  items: many(itemsTable),
  partners: many(partnersTable),
  documents: many(documentsTable),
  invites: many(invitesTable),
  subscription: one(subscriptionsTable),
  meta: one(comapniesMetaTable),
  navData: one(navDataTable),
}));

export const comapniesMetaTable = pgTable("companies_meta", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  bidSerial: integer('bid_seial').notNull().default(0),
  denSerial: integer('den_seial').notNull().default(0),
  conSerial: integer('con_seial').notNull().default(0),
  invSerial: integer('inv_seial').notNull().default(0),
  usedSpace: integer('used_space').notNull().default(0),
  usersNumber: integer('users_number').notNull().default(0),
  invitesNumber: integer('invites_number').notNull().default(0),
  year: integer('year').notNull().default(sql`EXTRACT(YEAR FROM NOW())`),
  companyID: uuid("company_id").references(() => companiesTable.id, { onDelete: "cascade" }).notNull(),
});

export const companiesMetaRelations = relations(comapniesMetaTable, ({ one }) => ({
  company: one(companiesTable, {
    fields: [comapniesMetaTable.companyID],
    references: [companiesTable.id],
  }),
}));

export const userToCompanyTable = pgTable("user_to_company", {
  userID: text("userid").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  companyID: uuid("company_id").references(() => companiesTable.id, { onDelete: "cascade" }).notNull(),
  createdAt,
  updatedAt,
}, (t) => ({
  pk: primaryKey({ columns: [t.userID, t.companyID] }),
}));

export const userToCompanyRelations = relations(userToCompanyTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userToCompanyTable.userID],
    references: [usersTable.id],
    relationName: "user_company"
  }),
  company: one(companiesTable, {
    fields: [userToCompanyTable.companyID],
    references: [companiesTable.id],
    relationName: "company_user"
  }),
}));


