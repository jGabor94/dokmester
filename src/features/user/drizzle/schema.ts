import { UserPermissions } from "@/features/authorization/utils/types";
import { companiesTable, userToCompanyTable } from "@/features/company/drizzle/schema";
import { createdAt, updatedAt } from "@/lib/drizzle/schemaTypes";
import { relations } from "drizzle-orm";
import { json, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  password: varchar('password', { length: 100 }).notNull().default(''),
  email: varchar('email', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  mobile: varchar('mobile', { length: 100 }).notNull(),
  permissions: json().$type<UserPermissions>().notNull(),
  createdAt,
  updatedAt,
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  companies: many(userToCompanyTable, { relationName: "user_company" }),
}));


export const invitesTable = pgTable("invites", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  companyID: uuid("company_id").references(() => companiesTable.id, { onDelete: "cascade" }).notNull(),
  createdAt,
  updatedAt,
});

export const invitesRelations = relations(invitesTable, ({ one }) => ({
  company: one(companiesTable, {
    fields: [invitesTable.companyID],
    references: [companiesTable.id],
  })
}));