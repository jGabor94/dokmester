"use server"

import { isLogged } from "@/features/authentication/utils"
import { getFullUserByID } from "@/features/user/queries"
import { db } from "@/lib/drizzle/db"
import { usersTable } from "@/lib/drizzle/schema"
import { createServerAction } from "@/lib/serverAction/createServerAction"
import { createServerActionResponse } from "@/lib/serverAction/response"
import { eq, sql } from "drizzle-orm"
import { Session } from "next-auth"
import { hasPermissionMiddleware } from "../utils"
import { GeneralPermissionObject } from "../utils/types"

interface Request_UpdateRoles {
  session: Session,
  params: [userid: string, permissions: GeneralPermissionObject],
}

const getUser = async ({ params }: Request_UpdateRoles) => await getFullUserByID(params[0])

export const SA_UpdatePermissions = createServerAction(isLogged, hasPermissionMiddleware("users", "update", getUser), async ({ params, session }: Request_UpdateRoles) => {
  const [userid, permissions] = params


  await db.update(usersTable).set({
    permissions: sql`jsonb_set(permissions::jsonb, ${sql.param(`{${session.user.companyID}}`)}, ${sql.param(JSON.stringify(permissions))})::json`,
  }).where(eq(usersTable.id, userid))
  return createServerActionResponse()
})

