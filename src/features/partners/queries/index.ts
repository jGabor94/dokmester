import { eq } from "drizzle-orm"
import { db } from "@/lib/drizzle/db"
import { partnersTable } from "../drizzle/schema"

const getPartners = async (companyID: string) => {
  return db.query.partnersTable.findMany({where: eq(partnersTable.companyID, companyID)})
}

export default getPartners