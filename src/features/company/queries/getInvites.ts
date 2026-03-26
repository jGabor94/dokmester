import { db } from "@/lib/drizzle/db"
import { invitesTable } from "@/lib/drizzle/schema"
import { eq } from "drizzle-orm"

const getInvites = async (companyID: string) => db.query.invitesTable.findMany({
  where: eq(invitesTable.companyID, companyID),
})

export default getInvites