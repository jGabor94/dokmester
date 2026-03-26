import { db } from "@/lib/drizzle/db"
import { comapniesMetaTable, companiesTable, documentsTable } from "@/lib/drizzle/schema"
import { generateMonogram } from "@/lib/utils"
import { and, desc, eq, gte, like, lte, or, sql } from "drizzle-orm"
import { DocType } from "../lib/types/document"

export const getDocuments = async (companyID: string, searchParams: any) => {
  return db.query.documentsTable.findMany({
    where: and(
      eq(documentsTable.companyID, companyID),
      (searchParams?.type && searchParams?.type != 'ALL' ? eq(
        documentsTable.type, searchParams.type
      ) : undefined),
      (searchParams?.state && searchParams?.state != 'ALL' ? eq(
        documentsTable.state, searchParams.state
      ) : undefined),
      (searchParams?.search && searchParams?.search != '' ? or(
        sql`${documentsTable.data}#>>'{applicant,name}' LIKE ${`%${searchParams?.search}%`}`,
        sql`${documentsTable.data}#>>'{applicant,taxnumber}' LIKE ${`%${searchParams?.search}%`}`,
        like(documentsTable.name, `%${searchParams?.search}%`),
      ) : undefined),
      (searchParams?.startdate && searchParams?.startdate != '' ? gte(
        documentsTable.createdAt, new Date(searchParams.startdate)
      ) : undefined),
      (searchParams?.enddate && searchParams?.enddate != '' ? lte(
        documentsTable.createdAt, new Date(searchParams.enddate)
      ) : undefined),
    ),
    orderBy: [desc(documentsTable.createdAt)]
  })
}

export const getDocument = async (docID: string) => {
  return db.query.documentsTable.findFirst({
    where: eq(documentsTable.id, docID)
  })
}

export const genDocName = async (type: DocType, companyID: string, metaUpdate = false) => {
  const columnName = `${type.toLowerCase()}Serial` as "bidSerial" | "denSerial" | "conSerial" | "invSerial"

  let companyMeta = null

  if (metaUpdate) {
    const [updatedCompanyMeta] = await db.update(comapniesMetaTable)
      .set({ [columnName]: sql`${comapniesMetaTable[columnName]} + 1` })
      .where(eq(comapniesMetaTable.companyID, companyID))
      .returning()

    companyMeta = updatedCompanyMeta
  } else {
    const res = await db.query.comapniesMetaTable.findFirst({
      where: eq(comapniesMetaTable.companyID, companyID)
    })

    if (res) {
      companyMeta = { ...res, [columnName]: res[columnName] + 1 }
    }

  }

  const company = await db.query.companiesTable.findFirst({
    where: eq(companiesTable.id, companyID),
    columns: {
      monogram: true,
      name: true,
    }
  })

  if (!company || !companyMeta) throw new Error()

  return `${company.monogram ? company.monogram : generateMonogram(company.name)}-${type}-${companyMeta.year}-${companyMeta[columnName]}`

}
