import { db } from "@/lib/drizzle/db";
import { documentsTable } from "@/lib/drizzle/schema";
import { and, eq, gte } from "drizzle-orm";

export const getChartData = async (companyID: string, year: string) => {
  return await db.query.documentsTable.findMany({
    where: and(
      eq(documentsTable.companyID, companyID),
      gte(documentsTable.createdAt, new Date(year)),
    ),
  })
}