"use server"

import { isLogged } from "@/features/authentication/utils";
import { hasPermissionMiddleware } from "@/features/authorization/utils";
import { getFullCompaniesByUser } from "@/features/company/queries/getCompany";
import { sendDeletedCompanyMail } from "@/features/email/sendMail";
import { db } from "@/lib/drizzle/db";
import { companiesTable, userToCompanyTable } from "@/lib/drizzle/schema";
import { createServerAction } from "@/lib/serverAction/createServerAction";
import { createServerActionResponse } from "@/lib/serverAction/response";
import { resolverMiddleware } from "@/lib/zod/resolverMiddleware";
import { listFiles } from "@/utils/listFiles";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { usersTable } from "../drizzle/schema";
import { editUserFormSchema, passwordChangeSchema } from "../lib/zodSchema";
import { getFullUserByID, getUserByID } from "../queries";
import { EditUserInputs, PasswordChangeInputs } from "../utils/types";

const supabase = createClient(process.env.SUPABASE_PROJECT_URL as string, process.env.SUPABASE_API_KEY as string)
const stripe = new Stripe(process.env.STRIPE_SECRET as string);


//--------------------------------------------------------------------------------------------------------------------

export const SA_IsUserExist = createServerAction(async ({ params }: { params: [email: string] }) => {
  const [email] = params;
  const user = await db.query.companiesTable.findFirst({ where: eq(usersTable.email, email) });

  return createServerActionResponse({ status: 200, payload: { exist: user ? true : false } })
});


//--------------------------------------------------------------------------------------------------------------------
interface Request_UpdateUser {
  session: Session,
  params: [userData: EditUserInputs],
}

export const SA_UpdateUser = createServerAction(isLogged, resolverMiddleware(editUserFormSchema, async (params) => params[0]), async ({ params, session }: Request_UpdateUser) => {
  const [userData] = params;


  await db.update(usersTable).set({ ...userData }).where(eq(usersTable.id, session?.user.id))
  return createServerActionResponse();
})

//--------------------------------------------------------------------------------------------------------------------
interface Request_DeleteUserFromCompany {
  session: Session,
  params: [userID: string],
}

const getUser = async ({ params }: Request_DeleteUserFromCompany) => await getFullUserByID(params[0])

export const SA_DeleteUserFromCompany = createServerAction(isLogged, hasPermissionMiddleware("users", "delete", getUser), async ({ params, session }: Request_DeleteUserFromCompany) => {
  const [userID] = params;

  await db.update(usersTable).set({
    permissions: sql`permissions::jsonb - ${sql.param(session.user.companyID)}`,
  }).where(eq(usersTable.id, userID))

  await db.delete(userToCompanyTable).where(eq(userToCompanyTable.userID, userID))
  revalidatePath("/dashboard/options/users", "page")

  return createServerActionResponse();
})


//--------------------------------------------------------------------------------------------------------------------
interface Request_UpdateAvatar {
  session: Session,
  params: [file: File],
}


export const SA_UpdateAvatar = createServerAction(isLogged, async ({ params, session }: Request_UpdateAvatar) => {
  const [file] = params;

  const { data, error } = await supabase
    .storage
    .from('images')
    .update(`avatar/${session.user.id}`, await file.arrayBuffer(), {
      upsert: true,
      contentType: file.type
    })

  if (error) {
    console.log(error)
    throw error
  }

  return createServerActionResponse();
})


//--------------------------------------------------------------------------------------------------------------------
interface Request_DeleteAvatar {
  session: Session,
}


export const SA_DeleteAvatar = createServerAction(isLogged, async ({ session }: Request_DeleteAvatar) => {

  const { data, error } = await supabase
    .storage
    .from('images')
    .remove([`avatar/${session.user.id}`])


  if (error) {
    console.log(error)
    throw error
  }

  return createServerActionResponse();
})


//--------------------------------------------------------------------------------------------------------------------
interface Request_PasswordChange {
  session: Session,
  params: [inputs: PasswordChangeInputs]
}


export const SA_PasswordChange = createServerAction(
  isLogged,
  resolverMiddleware(passwordChangeSchema, async (params) => params[0]),
  async ({ session, params }: Request_PasswordChange) => {

    const [inputs] = params;

    const user = await getFullUserByID(session.user.id)

    if (!user) return createServerActionResponse({ status: 400, error: "Felhasználó nem található" })

    const passwordMatch = await bcrypt.compare(inputs.currentPassword, user.password);

    if (!passwordMatch) return createServerActionResponse({ status: 400, error: "Helytelen jelszó" })

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(inputs.password, salt);

    await db.update(usersTable).set({ password: hashedPassword }).where(eq(usersTable.id, session.user.id))

    return createServerActionResponse();
  })

//--------------------------------------------------------------------------------------------------------------------
interface Request_DeleteAccount {
  session: Session,
}


export const SA_DeleteAccount = createServerAction(
  isLogged,
  async ({ session }: Request_DeleteAccount) => {

    const user = await getUserByID(session.user.id)

    if (!user) return createServerActionResponse({ status: 400, error: "Felhasználó nem található" })

    const companies = await getFullCompaniesByUser(user.id)


    await Promise.all(companies.map((company) => (async () => {

      if (user.permissions[company.id]["company"]?.includes("delete")) {


        if (company.subscription.subID) {
          await stripe.subscriptions.cancel(company.subscription.subID);
        }

        await stripe.customers.del(company.subscription.customerID);

        const list = await listFiles("documents", company.id)

        await Promise.all(company.users.map((user) => sendDeletedCompanyMail(user, company.name)))

        const { error } = await supabase.storage.from(`documents`).remove(list.map(file => file.name))
        if (error) {
          console.log(error)
          throw error
        }

        await db.delete(companiesTable).where(eq(companiesTable.id, company.id))

      }


    })()))

    const { error } = await supabase.storage.from(`images`).remove([`avatar/${user.id}`])
    if (error) {
      console.log(error)
      throw error
    }

    await db.delete(usersTable).where(eq(usersTable.id, user.id))



    return createServerActionResponse();
  })


