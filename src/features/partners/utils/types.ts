import { z } from "zod";
import { partnersTable } from "../drizzle/schema";
import { PartnerFormSchema } from "../zod";

export type InsertPartner = typeof partnersTable.$inferInsert;
export type SelectPartner = typeof partnersTable.$inferSelect;

export type PartnerInputs = z.infer<typeof PartnerFormSchema>