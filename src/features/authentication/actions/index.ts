"use server"

import { signIn, unstable_update } from "@/features/authentication/lib/auth"
import { permissionSet } from "@/features/authorization/lib/constants"
import { sendPasswordReset } from "@/features/email/sendMail"
import { subscriptionsTable } from "@/features/subscription/drizzle/schema"
import { confirmPasswordSchema, registerUserFormSchema } from "@/features/user/lib/zodSchema"
import { getFullUser, getFullUserByID } from "@/features/user/queries"
import { PasswordResetInputs, RegisterUserInputs } from "@/features/user/utils/types"
import { db } from "@/lib/drizzle/db"
import { comapniesMetaTable, companiesTable, invitesTable, usersTable, userToCompanyTable } from "@/lib/drizzle/schema"
import { createServerAction } from "@/lib/serverAction/createServerAction"
import { createServerActionResponse } from "@/lib/serverAction/response"
import { resolverMiddleware } from "@/lib/zod/resolverMiddleware"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { Session } from "next-auth"
import postgres from "postgres"
import Stripe from "stripe"
import { registerFormSchema } from "../lib/zodSchema"
import { isLogged } from "../utils"
import { RegisterForm } from "../utils/types"

export const SA_SignIn = async (email: string, password: string) => {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false
    })
    return {
      success: true,
      error: null
    }
  } catch (err) {
    return {
      success: false,
      error: "Invalid credential data"
    }
  }
}


const stripe = new Stripe(process.env.STRIPE_SECRET as string);

//--------------------------------------------------------------------------------------------------------------------
interface Request_SignUp {
  params: [registerForm: RegisterForm],
}


export const SA_SignUp = createServerAction(resolverMiddleware(registerFormSchema, async (params) => params[0]), async ({ params }: Request_SignUp) => {

  const [registerForm] = params;

  const { user, company } = registerForm;

  const companyExist = await db.query.companiesTable.findFirst({ where: eq(companiesTable.taxnumber, company.taxnumber) });
  if (companyExist) {
    return createServerActionResponse({ status: 409, error: 'A cég már létezik!' });
  }

  const userExist = await db.query.usersTable.findFirst({ where: eq(usersTable.email, user.email) });
  if (userExist) {
    return createServerActionResponse({ status: 409, error: 'A felhasználó már létezik!' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  const customer = await stripe.customers.create({
    email: user.email,
    name: company.name,
  });

  const [createdCompany] = await db.insert(companiesTable).values({
    ...company,
  }).returning()

  await db.insert(subscriptionsTable).values({
    customerID: customer.id,
    companyID: createdCompany.id
  }).returning()

  await db.insert(comapniesMetaTable).values({
    companyID: createdCompany.id
  }).returning()

  const [createdUser] = await db.insert(usersTable).values({
    ...user,
    password: hashedPassword,
    permissions: {
      [createdCompany.id]: permissionSet
    },
  }).returning()

  await db.insert(userToCompanyTable).values({ companyID: createdCompany.id, userID: createdUser.id })

  return createServerActionResponse({ payload: { createdUser, customerID: customer.id } })

})

//--------------------------------------------------------------------------------------------------------------------
interface Request_JoinToCompany {
  params: [registerUserForm: RegisterUserInputs, inviteID: string],
}


export const SA_JoinToCompany = createServerAction(resolverMiddleware(registerUserFormSchema, async (params) => params[0]), async ({ params }: Request_JoinToCompany) => {

  const [userData, inviteID] = params

  const invite = await db.query.invitesTable.findFirst({
    where: eq(invitesTable.id, inviteID),
    with: {
      company: true
    }
  })

  if (!invite) {
    return createServerActionResponse({ status: 409, error: 'Meghívó nem létezik!' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const [createdUser] = await db.insert(usersTable).values({
      ...userData,
      password: hashedPassword,
      email: invite.email,
      permissions: {
        [invite.companyID]: {}
      },
    }).returning()

    await db.insert(userToCompanyTable).values({ companyID: invite.companyID, userID: createdUser.id })

    await db.delete(invitesTable).where(eq(invitesTable.id, inviteID))
    return createServerActionResponse()

  } catch (err) {
    if (err instanceof postgres.PostgresError && err.constraint_name === "users_email_unique") {
      return createServerActionResponse({ status: 409, error: 'A felhasználó már létezik!' });
    }
    throw err
  }

})

//--------------------------------------------------------------------------------------------------------------------
interface Request_RefreshSession {
  session: Session
}

export const SA_RefreshSession = createServerAction(isLogged, async ({ session }: Request_RefreshSession) => {
  const userData = await getFullUserByID(session.user.id)

  if (!userData) return createServerActionResponse({ status: 400 })

  if (userData.companies.length === 0) {
    await unstable_update({
      ...session, user: {
        ...session.user, ...{
          id: userData.id,
          companyID: null,
          customerID: null,
          name: userData.name,
          email: userData.email,
          permissions: {},
          feature: null
        }
      }
    })
    return createServerActionResponse()

  }

  const selectedCompany = userData.companies.find((company) => company.id === session.user.companyID) || userData.companies[0]
  const feature = selectedCompany?.subscription.feature ? selectedCompany?.subscription.feature : null

  if (userData) {
    await unstable_update({
      ...session, user: {
        ...session.user, ...{
          id: userData.id,
          companyID: selectedCompany.id,
          customerID: selectedCompany.subscription.customerID,
          name: userData.name,
          email: userData.email,
          permissions: userData.permissions[selectedCompany.id],
          feature
        }
      }
    })
  }

  return createServerActionResponse()

})


//--------------------------------------------------------------------------------------------------------------------
interface Request_SendPasswrordReset {
  params: [email: string],
}

export const SA_SendPasswrordReset = createServerAction(async ({ params }: Request_SendPasswrordReset) => {
  const [email] = params;
  const userData = await getFullUser(email)

  if (!userData) return createServerActionResponse({ status: 409, error: 'Ez a felhasználó nem létezik ezzel az E-mail címmel!' });

  await sendPasswordReset(email, userData.name, userData.id)

  return createServerActionResponse()

})

//--------------------------------------------------------------------------------------------------------------------
interface Request_PasswordChange {
  params: [inputs: PasswordResetInputs, userID: string],
}

export const SA_PasswordChange = createServerAction(resolverMiddleware(confirmPasswordSchema, async (params) => params[0]), async ({ params }: Request_PasswordChange) => {
  const [inputs, userID] = params;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(inputs.password, salt);

  await db.update(usersTable).set({ password: hashedPassword }).where(eq(usersTable.id, userID))

  return createServerActionResponse()

})