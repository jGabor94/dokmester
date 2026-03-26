'use server'
import { isLogged } from "@/features/authentication/utils";
import { hasPermissionMiddleware, hasSubPermissionMiddleware } from "@/features/authorization/utils";
import { db } from "@/lib/drizzle/db";
import { createServerAction } from "@/lib/serverAction/createServerAction";
import { createServerActionResponse } from "@/lib/serverAction/response";
import { resolverMiddleware } from "@/lib/zod/resolverMiddleware";
import { and, eq, or } from "drizzle-orm";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { partnersTable } from "../drizzle/schema";
import { PartnerInputs } from "../utils/types";
import { PartnerFormSchema } from "../zod";

interface Request_CreateUpdatePartner {
  session: Session
  params: [data: PartnerInputs],
}

export const SA_CreatePartner = createServerAction(
  isLogged,
  hasSubPermissionMiddleware("partner", "create"),
  hasPermissionMiddleware("partner", "create"),
  resolverMiddleware(PartnerFormSchema, async (params) => params[0]),
  async ({ params, session }: Request_CreateUpdatePartner) => {
    const [data] = params;
    const companyID = session.user.companyID as string

    const partner = await db.query.partnersTable.findFirst({ where: and(eq(partnersTable.companyID, companyID), or(eq(partnersTable.taxnumber, data.taxnumber ?? ''), eq(partnersTable.email, data.email))) });

    if (partner) {
      return createServerActionResponse({ status: 409, error: 'Ez a partner már létezik!' });
    }

    await db.insert(partnersTable).values({ ...data, companyID, mobile: data.mobile ?? '', taxnumber: data.taxnumber ?? '' });
    revalidatePath('/dashboard/partners', "page")
    return createServerActionResponse();
  })

//---------------------------------------------------------------

export const SA_UpdatePartner = createServerAction(
  isLogged,
  hasSubPermissionMiddleware("partner", "update"),
  hasPermissionMiddleware("partner", "update"),
  resolverMiddleware(PartnerFormSchema, async (params) => params[0]),
  async ({ params, session }: Request_CreateUpdatePartner) => {
    const [data] = params;
    const companyID = session.user.companyID as string

    const partner = await db.query.partnersTable.findFirst({ where: and(eq(partnersTable.companyID, companyID), or(eq(partnersTable.taxnumber, data.taxnumber ?? ''), eq(partnersTable.email, data.email))) });

    if (partner) {
      await db.update(partnersTable).set({ ...data, mobile: data.mobile ?? '', taxnumber: data.taxnumber ?? '' }).where(eq(partnersTable.id, partner.id));
      revalidatePath('/dashboard/partners', "page")
      return createServerActionResponse();
    }

    return createServerActionResponse({ status: 409 });
  })

//---------------------------------------------------------------

interface Request_DeletePartner {
  params: [parnerID: string],
}

export const SA_DeletePartner = createServerAction(
  isLogged,
  hasSubPermissionMiddleware("partner", "delete"),
  hasPermissionMiddleware("partner", "delete"),
  async ({ params }: Request_DeletePartner) => {
    const [partnerID] = params;
    await db.delete(partnersTable).where(eq(partnersTable.id, partnerID))
    revalidatePath('/dashboard/partners', "page");
    return createServerActionResponse();
  })