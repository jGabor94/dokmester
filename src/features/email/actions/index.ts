"use server"

import { genVerifyCode, isLogged } from "@/features/authentication/utils"
import { hasPermissionMiddleware } from "@/features/authorization/utils"
import { DocType, SelectDocument } from "@/features/documents/lib/types/document"
import { getInvoice } from "@/features/invoice/queries"
import { db } from "@/lib/drizzle/db"
import { documentsTable, invoicesTable } from "@/lib/drizzle/schema"
import { createServerAction } from "@/lib/serverAction/createServerAction"
import { createServerActionResponse } from "@/lib/serverAction/response"
import { createClient } from "@supabase/supabase-js"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { sendInvoiceMail, sendVerifyCode } from "../sendMail"
import { docMailMap } from "../utils"

const supabase = createClient(process.env.SUPABASE_PROJECT_URL as string, process.env.SUPABASE_API_KEY as string)


//--------------------------------------------------------------------------------------------------------------------
interface Request_SendInvoiceMail {
  params: [docID: string, customHtml?: string],
}

export const SA_SendInvoiceMail = createServerAction(
  isLogged,
  hasPermissionMiddleware("INV", "send"),
  async ({ params }: Request_SendInvoiceMail) => {

    const [docID, customHtml] = params;

    const invoice = await getInvoice(docID)

    if (!invoice) return createServerActionResponse({ status: 404, payload: "Számla nem található!" })

    const { data: file, error } = await supabase
      .storage
      .from('documents')
      .download(`${invoice.companyID}/${invoice.fileName}`)

    if (error) {
      console.log(error)
      throw error
    }

    await sendInvoiceMail(invoice, file, customHtml)
    await db.update(invoicesTable).set({ status: "sended" }).where(eq(invoicesTable.id, invoice.id))

    revalidatePath("/dashboard/documents/invoice", "page")

    return createServerActionResponse()
  })

//--------------------------------------------------------------------------------------------------------------------
interface Request_SendDocumentMail {
  params: [docID: string, type: DocType, customHtml?: string],
  document: SelectDocument
}

export const SA_SendDocumentMail = createServerAction(
  isLogged,
  hasPermissionMiddleware(async ({ params }: Request_SendDocumentMail) => params[1], "send"),
  async ({ params, document }: Request_SendDocumentMail) => {

    const [docID, _, customHtml] = params;

    const { data: file, error } = await supabase
      .storage
      .from('documents')
      .download(`${document.companyID}/${document.type}/${document.file}`)

    if (error) {
      console.log(error)
      throw error
    }

    await docMailMap[document.type](document, file, customHtml)
    await db.update(documentsTable).set({ state: "sended" }).where(eq(documentsTable.id, document.id))

    revalidatePath("/dashboard/documents", "page")

    return createServerActionResponse()
  })


//--------------------------------------------------------------------------------------------------------------------
interface Request_SendVerifyCode {
  params: [email: string, name: string],
}

export const SA_SendVerifyCode = createServerAction(async ({ params }: Request_SendVerifyCode) => {

  const [email, name] = params

  const code = genVerifyCode()
  await sendVerifyCode(email, name, code)

  return createServerActionResponse({ status: 200, payload: code })
})







