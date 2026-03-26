import { companiesTable } from "@/lib/drizzle/schema";
import { createdAt, updatedAt } from "@/lib/drizzle/schemaTypes";
import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { Feature } from "../utils/types";

export const subscriptionsTable = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  customerID: varchar('customer_id', { length: 255 }).notNull().unique(),
  feature: varchar('feature', { length: 255 }).$type<Feature>(),
  subID: varchar('sub_id', { length: 255 }).unique(),
  csID: varchar('cs_id', { length: 255 }).unique(),
  companyID: uuid("company_id").references(() => companiesTable.id, { onDelete: "cascade" }).notNull(),
  createdAt,
  updatedAt,
});

export const subscriptionsRelations = relations(subscriptionsTable, ({ one }) => ({
  company: one(companiesTable, {
    fields: [subscriptionsTable.companyID],
    references: [companiesTable.id],
  }),
}));