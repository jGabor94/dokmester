import { db } from "@/lib/drizzle/db";
import { eq } from "drizzle-orm";
import { usersTable } from "../drizzle/schema";

export const getUserByEmail = async (email: string) => await db.query.usersTable.findFirst({
  where: eq(usersTable.email, email),
  columns: {
    password: false
  },
})

export const getUserByID = async (userid: string) => await db.query.usersTable.findFirst({
  where: eq(usersTable.id, userid),
  columns: {
    password: false
  }
})


export const getFullUser = async (email: string) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
    with: {
      companies: {
        with: {
          company: {
            with: {
              subscription: true
            }
          }
        }
      }
    },
  })

  if (user) {
    return {
      ...user, companies: user.companies.map(junctionRow => {
        return junctionRow.company as Omit<typeof junctionRow.company, "subscription"> & { subscription: NonNullable<typeof junctionRow.company.subscription> }
      })
    }

  }

}

export const getFullUserByID = async (userid: string) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userid),
    with: {
      companies: {
        with: {
          company: {
            with: {
              subscription: true
            }
          }
        }
      }
    },
  })

  if (user) {
    return {
      ...user, companies: user.companies.map(junctionRow => {
        return junctionRow.company as Omit<typeof junctionRow.company, "subscription"> & { subscription: NonNullable<typeof junctionRow.company.subscription> }
      })
    }

  }

}

