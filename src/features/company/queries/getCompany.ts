import { db } from "@/lib/drizzle/db"
import { companiesTable, itemsTable, subscriptionsTable, userToCompanyTable } from "@/lib/drizzle/schema"
import { desc, eq } from "drizzle-orm"

export const getCompanyByCustomer = async (customerID: string) => {

  const subscription = await db.query.subscriptionsTable.findFirst({
    where: eq(subscriptionsTable.customerID, customerID),
    with: {
      company: true
    }
  })

  return subscription?.company

}

export const getFullCompany = async (companyID: string) => {

  const compnay = await db.query.companiesTable.findFirst({
    where: eq(companiesTable.id, companyID),
    with: {
      items: {
        orderBy: [desc(itemsTable.createdAt), desc(itemsTable.name)]
      },
      users: {
        with: {
          user: true
        },
        orderBy: [desc(userToCompanyTable.createdAt)]
      },
      partners: true,
      meta: true,
      subscription: true,
      navData: true
    }
  })

  if (compnay) {
    const formatted = { ...compnay, users: compnay.users.map(junctionRow => junctionRow.user) }

    return formatted as Omit<typeof formatted, "meta"> & {
      meta: NonNullable<typeof formatted.meta>
    }
  }
}


export const getCompaniesByUser = async (userID: string) => (await db.query.userToCompanyTable.findMany({
  where: eq(userToCompanyTable.userID, userID),
  with: {
    company: true
  }

})).map(junctionRow => junctionRow.company)


export const getFullCompaniesByUser = async (userID: string) => (await db.query.userToCompanyTable.findMany({
  where: eq(userToCompanyTable.userID, userID),
  with: {
    company: {
      with: {
        items: {
          orderBy: [desc(itemsTable.createdAt), desc(itemsTable.name)]
        },
        users: {
          with: {
            user: true
          },
          orderBy: [desc(userToCompanyTable.createdAt)]
        },
        partners: true,
        meta: true,
        subscription: true
      }
    }
  }

})).map(junctionRow => {

  const formatted = { ...junctionRow.company, users: junctionRow.company.users.map(junctionRow => junctionRow.user) }

  return formatted as Omit<typeof formatted, "meta" | "subscription"> & { meta: NonNullable<typeof formatted.meta>, subscription: NonNullable<typeof formatted.subscription> }

})