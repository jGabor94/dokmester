"use server"

import { isLogged } from "@/features/authentication/utils";
import { hasPermissionMiddleware, hasSubPermissionMiddleware } from "@/features/authorization/utils";
import { getFullCompany } from "@/features/company/queries/getCompany";
import { db } from "@/lib/drizzle/db";
import { createServerAction } from "@/lib/serverAction/createServerAction";
import { createServerActionResponse } from "@/lib/serverAction/response";
import { createClient } from '@supabase/supabase-js';
import { eq, or, sql } from "drizzle-orm";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { type } from "os";
import { v4 as uuidv4 } from 'uuid';
import { documentsTable } from "../drizzle/schema";
import { DocStatus, DocType, DocumentInputs, InvoiceInputs, SelectDocument } from "../lib/types/document";
import { genDocName } from "../queries";
import { getDocumentMiddleware } from "../utils/server";

const supabase = createClient(process.env.SUPABASE_PROJECT_URL as string, process.env.SUPABASE_API_KEY as string)

//--------------------------------------------------------------------------------------------------------------------

interface Request_GetDocument {
  params: [fileName: string],
  session: Session
}

export const SA_GetDocument = createServerAction(isLogged, async ({ params, session }: Request_GetDocument) => {
  const [fileName] = params;

  const { data, error } = await supabase
    .storage
    .from('documents')
    .download(`${session.user.companyID}/${fileName}`)

  if (error) {
    console.log(error)
    throw error
  }

  return createServerActionResponse({ status: 200, payload: data })
})

//--------------------------------------------------------------------------------------------------------------------
interface Request_SaveDoc {
  params: [data: Exclude<DocumentInputs, InvoiceInputs>, pdf: Blob],
  session: Session
}

const loadData = async (req: Request_SaveDoc) => {
  const company = await getFullCompany(req.session.user.companyID as string)
  if (company) {
    return {
      usedSpace: company.meta.usedSpace,
      newFileSize: req.params[1].size
    }
  }
}

export const SA_SaveDocument = createServerAction(
  isLogged,
  hasSubPermissionMiddleware("document", "create", loadData),
  hasPermissionMiddleware(async ({ params }: Request_SaveDoc) => params[0].type, "create"),
  async ({ params, session }: Request_SaveDoc) => {

    const [data, pdf] = params;
    const companyID = session.user.companyID as string
    const docName = await genDocName(data.type, companyID, true)

    const docID = uuidv4()

    const { error } = await supabase.storage.from(`documents`).upload(`${session.user.companyID}/${data.type}/${docID}.pdf`, await pdf.arrayBuffer())
    if (error) {
      console.log(error)
      throw error
    }

    const [createdDoc] = await db.insert(documentsTable).values({
      name: docName,
      state: "pending",
      data,
      file: `${docID}.pdf`,
      companyID: session.user.companyID,
      size: pdf.size
    }).returning()

    return createServerActionResponse({ status: 200, payload: { createdDoc } })

  })



//--------------------------------------------------------------------------------------------------------------------
interface Request_GenDocName {
  params: [type: DocType],
  session: Session
}

export const SA_GenDocName = createServerAction(isLogged, async ({ params, session }: Request_GenDocName) => {

  const [type] = params;
  const companyID = session.user.companyID as string

  const docName = await genDocName(type, companyID)

  return createServerActionResponse({ status: 200, payload: { docName } })

})

//--------------------------------------------------------------------------------------------------------------------
interface Request_UpdateDocument {
  params: [docID: string, status: DocStatus,],
  document: SelectDocument
}

export const SA_UpdateDocument = createServerAction(
  isLogged,
  getDocumentMiddleware(0),
  hasPermissionMiddleware(async ({ document }: Request_UpdateDocument) => document.data.type, "update"),
  async ({ params }: Request_UpdateDocument) => {
    const [docID, status] = params;
    await db.update(documentsTable).set({ state: status }).where(eq(documentsTable.id, docID))
    revalidatePath("/dashboard/documents", "page")
    return createServerActionResponse()
  })


//--------------------------------------------------------------------------------------------------------------------
interface Request_DeleteDocument {
  params: [docID: string],
  document: SelectDocument,
  session: Session
}

export const SA_DeleteDocument = createServerAction(
  isLogged,
  getDocumentMiddleware(0),
  hasPermissionMiddleware(async ({ document }: Request_DeleteDocument) => document.data.type, "delete"),
  async ({ params, session }: Request_DeleteDocument) => {
    const [docID] = params;

    const { error } = await supabase.storage.from(`documents`).remove([`${session.user.companyID}/${type}/${docID}.pdf`])
    if (error) {
      console.log(error)
      throw error
    }



    const [deletedDoc] = await db.delete(documentsTable).where(eq(documentsTable.id, docID)).returning()

    if (deletedDoc.data.type === "INV" && deletedDoc.data.originalInvoice) {

      await db.update(documentsTable).set({
        data: sql`
    jsonb_set(
      data::jsonb,
      ${sql.param('{history}')},
      COALESCE(
        (
          SELECT jsonb_agg(elem)
          FROM jsonb_array_elements((data->'history')::jsonb) AS elem
          WHERE (elem->>'id') IS DISTINCT FROM ${sql.param(docID)}
        ),
        '[]'::jsonb
      )
    )
  `
      }).where(
        or(
          eq(documentsTable.id, deletedDoc.data.originalInvoice),
          sql`data->>'originalInvoice' = ${sql.param(deletedDoc.data.originalInvoice)}`
        )
      )

    }

    revalidatePath("/dashboard/documents", "page")
    return createServerActionResponse()
  })






