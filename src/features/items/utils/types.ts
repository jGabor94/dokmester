import * as z from 'zod';
import { itemsTable } from "../drizzle/schema";
import { itemTypesMap, vatRates } from '../lib/contants';
import { itemSchema } from "../lib/zodSchema";

export type InsertItems = typeof itemsTable.$inferInsert;
export type SelectItems = typeof itemsTable.$inferSelect;
export type ItemInput = z.infer<typeof itemSchema>
export type ItemInputs = {
  items: Array<ItemInput>
}

export type VatKey = typeof vatRates[number]["value"];
export type VatRate = typeof vatRates[number];
export type ItemType = keyof typeof itemTypesMap