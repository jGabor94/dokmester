"use server"

import { isLogged } from "@/features/authentication/utils";
import { hasPermissionMiddleware, hasSubPermissionMiddleware } from "@/features/authorization/utils";
import { getFullCompany } from "@/features/company/queries/getCompany";
import { genDocName } from "@/features/documents/queries";
import manageInvoice from "@/features/navApi/lib/api/manageInvoice";
import tokenExhange from "@/features/navApi/lib/api/tokenExhange";
import { createOperation } from "@/features/navApi/lib/createOperation";
import { InvoiceOperation } from "@/features/navApi/lib/types";
import { db } from "@/lib/drizzle/db";
import { navDataTable } from "@/lib/drizzle/schema";
import { createServerAction } from "@/lib/serverAction/createServerAction";
import { createServerActionResponse } from "@/lib/serverAction/response";
import { createClient } from '@supabase/supabase-js';
import { eq, or, sql } from "drizzle-orm";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from 'uuid';
import { invoicesTable } from "../drizzle/schema";
import { InvoiceInputs, InvoiceStatus, InvoiceType } from "../lib/types";

const supabase = createClient(process.env.SUPABASE_PROJECT_URL as string, process.env.SUPABASE_API_KEY as string)

//--------------------------------------------------------------------------------------------------------------------

interface Request_GetInvoice {
  params: [file: string],
  session: Session
}

export const SA_GetInvoice = createServerAction(isLogged, async ({ params, session }: Request_GetInvoice) => {
  const [file] = params;

  const { data, error } = await supabase
    .storage
    .from('documents')
    .download(`${session.user.companyID}/INV/${file}`)

  if (error) {
    console.log(error)
    throw error
  }

  return createServerActionResponse({ status: 200, payload: data })
})


//--------------------------------------------------------------------------------------------------------------------
interface Request_UpdateInvoice {
  params: [invoiceID: string, status: InvoiceStatus],
}

export const SA_UpdateInvoice = createServerAction(
  isLogged,
  hasPermissionMiddleware("INV", "update"),
  async ({ params }: Request_UpdateInvoice) => {
    const [invoiceID, status] = params;
    await db.update(invoicesTable).set({ status }).where(eq(invoicesTable.id, invoiceID))
    revalidatePath("/dashboard/documents/invoice", "page")
    return createServerActionResponse()
  })


//--------------------------------------------------------------------------------------------------------------------
interface Request_DeleteInvoice {
  params: [invoiceID: string],
  session: Session
}

export const SA_DeleteInvoice = createServerAction(
  isLogged,
  hasPermissionMiddleware("INV", "delete"),
  async ({ params, session }: Request_DeleteInvoice) => {
    const [invoiceID] = params;

    const { error } = await supabase.storage.from(`documents`).remove([`${session.user.companyID}/INV/${invoiceID}.pdf`])
    if (error) {
      console.log(error)
      throw error
    }

    const [deletedDoc] = await db.delete(invoicesTable).where(eq(invoicesTable.id, invoiceID)).returning()

    if (deletedDoc.originalInvoice) {

      await db.update(invoicesTable).set({
        history: sql`(
    SELECT COALESCE(
      jsonb_agg(elem),
      '[]'::jsonb
    )
    FROM jsonb_array_elements(${invoicesTable.history}) AS elem
    WHERE (elem->>'id') IS DISTINCT FROM ${sql.param(invoiceID)}
  )`
      })
        .where(
          or(
            eq(invoicesTable.id, deletedDoc.originalInvoice),
            eq(invoicesTable.originalInvoice, deletedDoc.originalInvoice)
          )
        )

    }

    revalidatePath("/dashboard/documents/invoice", "page")
    return createServerActionResponse()
  })


//--------------------------------------------------------------------------------------------------------------------
interface Request_SaveInvoice {
  params: [invoiceInputs: InvoiceInputs, pdf: Blob, originalInvoiceID?: string | null, invoiceType?: InvoiceType],
  session: Session
}


const loadData = async (req: Request_SaveInvoice) => {
  const company = await getFullCompany(req.session.user.companyID as string)
  if (company) {
    return {
      usedSpace: company.meta.usedSpace,
      newFileSize: req.params[1].size
    }
  }
}

export const SA_SaveInvoice = createServerAction(
  isLogged,
  hasSubPermissionMiddleware("document", "create", loadData),
  hasPermissionMiddleware("INV", "create"),
  async ({ params, session }: Request_SaveInvoice) => {

    const [invoiceInputs, pdf, originalInvoiceID, invoiceType = "CREATE"] = params;
    const companyID = session.user.companyID as string
    const docName = await genDocName("INV", companyID, true)
    let transactionID = null

    const navData = await db.query.navDataTable.findFirst({ where: eq(navDataTable.companyID, session?.user.companyID as string) })
    const originalInvoice = originalInvoiceID && await db.query.invoicesTable.findFirst({ where: eq(invoicesTable.id, originalInvoiceID) })

    if (invoiceType !== "CREATE" && !originalInvoice) return createServerActionResponse({ status: 409, error: "OriginalInvoiceID szükséges" })

    if (navData) {
      const company = await getFullCompany(session?.user.companyID as string)
      if (!company) return createServerActionResponse({ status: 409, error: "Cég nem létezik" })
      const { token } = await tokenExhange({ authData: navData, taxNumber: company.taxnumber })

      const invoiceOperations = [{
        operation: invoiceType,
        data: createOperation({
          ...invoiceType !== "CREATE" && originalInvoice && {
            invoiceReference: {
              originalInvoiceNumber: originalInvoice.name,
              modificationIndex: invoiceType === "MODIFY" ? originalInvoice.history.length : 1,
              itemsNumber: invoiceInputs.items.length,
            }
          },
          serialNumber: docName,
          supplier: invoiceInputs.supplier,
          customer: invoiceInputs.customer,
          invoiceDetail: {
            deliveryDate: invoiceInputs.completionDate,
            currencyCode: invoiceInputs.currency,
            exchangeRate: invoiceInputs.exchangeRate,
            paymentMethod: invoiceInputs.paymentMethod,
            paymentDate: invoiceInputs.dueDate,
          },
          lines: invoiceInputs.items
        })
      }] as InvoiceOperation[]

      transactionID = (await manageInvoice({ authData: navData, taxNumber: company.taxnumber, invoiceOperations, exchangeToken: token })).transactionID
    }



    const id = uuidv4()

    const { error } = await supabase.storage.from(`documents`).upload(`${session.user.companyID}/INV/${id}.pdf`, await pdf.arrayBuffer())
    if (error) {
      console.log(error)
      throw error
    }

    const newHistoryItem = {
      id,
      type: invoiceType,
      serial: originalInvoice ? originalInvoice.history.length + 1 : 1,
      name: docName,
      date: new Date(),
      itemsNumber: invoiceInputs.items.length,
    }

    if (originalInvoiceID) {
      await db.update(invoicesTable).set({
        history: sql`
    (COALESCE(history, '[]'::jsonb) || ${sql.param(JSON.stringify(newHistoryItem))}::jsonb)
  `
      }).where(
        or(
          eq(invoicesTable.id, originalInvoiceID),
          eq(invoicesTable.originalInvoice, originalInvoiceID)
        )
      );
    }

    const [createdDoc] = await db.insert(invoicesTable).values({
      id,
      name: docName,
      status: navData ? "validation" : "pending",
      fileName: `INV/${id}.pdf`,
      data: invoiceInputs,
      companyID: session.user.companyID,
      transactionID,
      history: originalInvoice ? [...originalInvoice.history, newHistoryItem] : [newHistoryItem],
      originalInvoice: originalInvoiceID ? originalInvoiceID : null,
      type: invoiceType,
      navStatus: navData ? "PENDING" : "INACTIVE",
      size: pdf.size
    }).returning()


    revalidatePath("/dashboard/documents/invoice", "page")

    return createServerActionResponse({ status: 200, payload: { createdDoc } })

  })







