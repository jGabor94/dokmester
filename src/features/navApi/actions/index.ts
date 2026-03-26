"use server"

import { isLogged } from "@/features/authentication/utils";
import { hasPermissionMiddleware } from "@/features/authorization/utils";
import { getFullCompany } from "@/features/company/queries/getCompany";
import { db } from "@/lib/drizzle/db";
import { navDataTable } from "@/lib/drizzle/schema";
import { createServerAction } from "@/lib/serverAction/createServerAction";
import { createServerActionResponse } from "@/lib/serverAction/response";
import { resolverMiddleware } from "@/lib/zod/resolverMiddleware";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { Session } from "next-auth";
import queryTransactionStatus from "../lib/api/queryTransactionStatus";
import tokenExhange from "../lib/api/tokenExhange";
import { createOperation } from "../lib/createOperation";
import { InvoiceData, InvoiceOperation, NavDataInputs } from "../lib/types";
import { navDataFormSchema } from "../lib/zodSchema";
import { encrypt } from "../utils";

//--------------------------------------------------------------------------------------------------------------------
interface Request_UpdateNavData {
  session: Session,
  params: [data: NavDataInputs],
}

export const SA_UpdateNavData = createServerAction(
  isLogged,
  hasPermissionMiddleware("company", "update"),
  resolverMiddleware(navDataFormSchema, async (params) => params[0]),
  async ({ params, session }: Request_UpdateNavData) => {

    const [data] = params;

    const navData = await db.query.navDataTable.findFirst({
      where: eq(navDataTable.companyID, session.user.companyID as string)
    })

    const newData = {
      userName: data.username,
      password: navData?.password === data.password ? navData.password : crypto.createHash("sha512").update(data.password, "utf8").digest("hex").toUpperCase(),
      signatureKey: navData?.signatureKey === data.signatureKey ? navData.signatureKey : encrypt(data.signatureKey),
      exchangeKey: navData?.exchangeKey === data.exchangeKey ? navData.exchangeKey : encrypt(data.exchangeKey)
    }

    if (navData) {
      await db.update(navDataTable).set(newData).where(eq(navDataTable.companyID, session.user.companyID as string))
    } else {
      await db.insert(navDataTable).values({ ...newData, companyID: session.user.companyID as string })
    }

    return createServerActionResponse({ status: 200 })
  })

//--------------------------------------------------------------------------------------------------------------------
interface Request_RequestExchnageToken {
  session: Session,
}

export const SA_RequestExchnageToken = createServerAction(
  isLogged,
  async ({ session }: Request_RequestExchnageToken) => {

    const navData = await db.query.navDataTable.findFirst({ where: eq(navDataTable.companyID, session?.user.companyID as string) })

    if (!navData) return createServerActionResponse({ status: 409, error: "NAV kapcsolati adatok nincsenek beállítva" })

    const company = await getFullCompany(session?.user.companyID as string)

    if (!company) return createServerActionResponse({ status: 409, error: "Cég nem létezik" })

    const res = await tokenExhange({ authData: navData, taxNumber: company.taxnumber })

    return createServerActionResponse({ status: 200, payload: res })
  })


const sampleInvoice: InvoiceData = {
  serialNumber: "OK-INV-2025-32423234423",
  supplier: {
    taxNumber: "59691154-1-27",
    name: "Jakucs Gábor",
    countryCode: "HUF",
    postalCode: 5510,
    city: "Dévaványa",
    address: "Zrínyi utca 3.",
  },
  customer: {
    vatStatus: "DOMESTIC",
    taxNumber: "59691143-3-27",
    name: "Nagy Pista",
    countryCode: "HU",
    postalCode: 5510,
    city: "Dévaványa",
    address: "Nap utca 21.",
  },
  invoiceDetail: {
    category: "NORMAL",
    currencyCode: "HUN",
    exchangeRate: 1,
    paymentMethod: "CARD",
    paymentDate: "2025-03-21",
    invoiceAppearance: "PAPER",
  },
  lines: [
    {
      name: "Webfejlesztés",
      unitPrice: 100000,
      unit: "weboldal",
      vatkey: 27,
      quantity: 2,
      lineNatureIndicator: "SERVICE",

    }
  ]
}


//--------------------------------------------------------------------------------------------------------------------
interface Request_ManageInvoice {
  session: Session,
}

export const SA_ManageInvoice = createServerAction(
  isLogged,
  async ({ session }: Request_ManageInvoice) => {

    const navData = await db.query.navDataTable.findFirst({ where: eq(navDataTable.companyID, session?.user.companyID as string) })

    if (!navData) return createServerActionResponse({ status: 409, error: "NAV kapcsolati adatok nincsenek beállítva" })

    const company = await getFullCompany(session?.user.companyID as string)

    if (!company) return createServerActionResponse({ status: 409, error: "Cég nem létezik" })

    const { token } = await tokenExhange({ authData: navData, taxNumber: company.taxnumber })

    const invoiceOperations = [
      { operation: "CREATE", data: createOperation(sampleInvoice) },

    ] as InvoiceOperation[]


    //const res = await manageInvoice({ authData: navData, taxNumber: company.taxnumber, invoiceOperations, exchangeToken: token })

    //const res2 = await queryTransactionStatus({ authData: navData, taxNumber: company.taxnumber, transactionId: res.transactionID, returnOriginalRequest: true })

    const res = await queryTransactionStatus({ authData: navData, taxNumber: company.taxnumber, transactionId: "4XOQG5H3BFGCFFKV", returnOriginalRequest: true })

    return createServerActionResponse({ status: 200, payload: { res } })
  })
