"use server"

import { unstable_update } from "@/features/authentication/lib/auth";
import { isLogged } from "@/features/authentication/utils";
import { permissionSet } from "@/features/authorization/lib/constants";
import { hasPermissionMiddleware, hasSubPermissionMiddleware } from "@/features/authorization/utils";
import { sendInviteMail } from "@/features/email/sendMail";
import { getFullUser, getFullUserByID } from "@/features/user/queries";
import { db } from "@/lib/drizzle/db";
import { invitesTable, subscriptionsTable, usersTable } from "@/lib/drizzle/schema";
import { createServerAction } from "@/lib/serverAction/createServerAction";
import { createServerActionResponse } from "@/lib/serverAction/response";
import { resolverMiddleware } from "@/lib/zod/resolverMiddleware";
import { createClient } from '@supabase/supabase-js';
import { eq, sql } from "drizzle-orm";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { v4 as uuidv4 } from 'uuid';
import { comapniesMetaTable, companiesTable, userToCompanyTable } from "../drizzle/schema";
import { companyFormSchema, createCompanyFormSchema } from "../lib/zodSchema";
import { getFullCompany } from "../queries/getCompany";
import { CompanyInputs, CreateCompanyForm } from "../utils/types";

const supabase = createClient(process.env.SUPABASE_PROJECT_URL as string, process.env.SUPABASE_API_KEY as string)
const stripe = new Stripe(process.env.STRIPE_SECRET as string);

//--------------------------------------------------------------------------------------------------------------------
interface Request_AddCompany {
  params: [addCompanyForm: CreateCompanyForm],
  session: Session
}


export const SA_CreateCompany = createServerAction(isLogged, resolverMiddleware(createCompanyFormSchema, async (params) => params[0]), async ({ params, session }: Request_AddCompany) => {

  const [addCompanyForm] = params;

  const { company } = addCompanyForm;

  const companyExist = await db.query.companiesTable.findFirst({ where: eq(companiesTable.taxnumber, company.taxnumber) });
  if (companyExist) {
    return createServerActionResponse({ status: 409, error: 'A cég már létezik!' });
  }

  const customer = await stripe.customers.create({
    email: session.user.email,
    name: company.name,
  });

  const [createdCompany] = await db.insert(companiesTable).values({
    ...company,
  }).returning()

  await db.insert(subscriptionsTable).values({
    customerID: customer.id,
    companyID: createdCompany.id,
  }).returning()




  await db.insert(comapniesMetaTable).values({ companyID: createdCompany.id }).returning()
  await db.insert(userToCompanyTable).values({ companyID: createdCompany.id, userID: session.user.id })

  await db.update(usersTable).set({
    permissions: sql`jsonb_set(permissions::jsonb, ${sql.param(`{${createdCompany.id}}`)}, ${sql.param(JSON.stringify(permissionSet))})::json`
  }).where(eq(usersTable.id, session.user.id))


  return createServerActionResponse({ payload: { customerID: customer.id } })

})

//--------------------------------------------------------------------------------------------------------------------
interface Request_UpdateCompany {
  session: Session,
  params: [companyForm: CompanyInputs, logo?: File, removedLogo?: string],
}

export const SA_UpdateCompany = createServerAction(
  isLogged,
  hasPermissionMiddleware("company", "update"),
  resolverMiddleware(companyFormSchema, async (params) => params[0]),
  async ({ params, session }: Request_UpdateCompany) => {
    const [companyForm, logo, removedLogo] = params;
    const companyID = session.user.companyID as string
    let logoName: string | undefined

    if (removedLogo) {
      const { error } = await supabase.storage.from('images').remove([removedLogo])

      if (error) {
        console.log(error)
        throw error
      }
    }

    if (logo) {
      logoName = `${uuidv4()}.${logo.type.split('/').pop()}`
      const { data, error } = await supabase.storage.from('images').upload(logoName, await logo.arrayBuffer())
      if (error) {
        console.log(error)
        throw error
      } else {
        logoName = data.path
      }
    }


    await db.update(companiesTable).set({ ...companyForm, logo: logoName ?? "default" }).where(eq(companiesTable.id, companyID))
    return createServerActionResponse();
  })

//--------------------------------------------------------------------------------------------------------------------
interface Request_InviteUser {
  session: Session,
  params: [email: string, companyName: string],
}

const usersCountLoader = async ({ session }: Request_InviteUser) => {
  if (session.user.companyID) {
    const company = await getFullCompany(session.user.companyID)
    if (company) return company.meta.usersNumber + company.meta.invitesNumber
  }
}

export const SA_InviteUser = createServerAction(
  isLogged,
  hasSubPermissionMiddleware("users", "create", usersCountLoader, "Elérted a felhasználók maximális számát az akutális előfizetésben"),
  hasPermissionMiddleware("invite", "create"),
  async ({ params, session }: Request_InviteUser) => {
    const [email, companyName] = params;
    const companyID = session.user.companyID as string
    const user = await getFullUser(email);
    if (user) {
      const isExist = user.companies.find((company) => company.id === companyID)
      if (isExist) {
        return createServerActionResponse({ status: 409, error: 'A felhasználó már létezik!' });
      }
    }

    const [createdInvite] = await db.insert(invitesTable)
      .values({ email, companyID })
      .onConflictDoUpdate({
        target: invitesTable.email,
        set: { updatedAt: new Date() }
      })
      .returning()

    createdInvite.id

    await sendInviteMail(email, companyName, createdInvite.id)
    revalidatePath("/dashboard/options/users", "page")
    return createServerActionResponse()
  })

//--------------------------------------------------------------------------------------------------------------------
interface Request_DeleteInvite {
  session: Session,
  params: [inviteID: string],
}

export const SA_DeleteInvite = createServerAction(isLogged, hasPermissionMiddleware("invite", "delete"), async ({ params, session }: Request_DeleteInvite) => {
  const [inviteID] = params;
  await db.delete(invitesTable).where(eq(invitesTable.id, inviteID))
  revalidatePath("/dashboard/users", "page")
  return createServerActionResponse()
})

//--------------------------------------------------------------------------------------------------------------------
export const SA_IsCompanyExist = createServerAction(async ({ params }: { params: [taxNumber: string] }) => {
  const [taxNumber] = params;
  const company = await db.query.companiesTable.findFirst({ where: eq(companiesTable.taxnumber, taxNumber) });
  return createServerActionResponse({ status: 200, payload: { exist: company ? true : false } })
})

//--------------------------------------------------------------------------------------------------------------------
interface Request_CompanyChange {
  session: Session,
  params: [companyID: string],
}

export const SA_CompanyChange = createServerAction(isLogged, async ({ params, session }: Request_CompanyChange) => {
  const [companyID] = params;
  const user = await getFullUserByID(session.user.id)
  if (user) {
    const selectedCompany = user.companies.find((company) => company.id === companyID)
    const feature = selectedCompany?.subscription.feature ? selectedCompany?.subscription.feature : null
    await unstable_update({
      ...session, user: {
        ...session.user,
        customerID: selectedCompany?.subscription.customerID,
        companyID,
        permissions: user.permissions[companyID],
        feature
      }
    })
    return createServerActionResponse()
  }
  return createServerActionResponse({ status: 400 })
})













