import { db } from "@/lib/drizzle/db"
import { desc, eq } from "drizzle-orm"
import { itemsTable } from "../drizzle/schema"

const getItems = async (companyID: string) => {
  return db.query.itemsTable.findMany({
    where: eq(itemsTable.companyID, companyID),
    orderBy: [desc(itemsTable.createdAt), desc(itemsTable.name)]
  })
}

export default getItems