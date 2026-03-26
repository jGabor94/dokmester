"use server"

import { isLogged } from "@/features/authentication/utils"
import { hasPermissionMiddleware, hasSubPermissionMiddleware } from "@/features/authorization/utils"
import { db } from "@/lib/drizzle/db"
import { createServerAction } from "@/lib/serverAction/createServerAction"
import { createServerActionResponse } from "@/lib/serverAction/response"
import { resolverMiddleware } from "@/lib/zod/resolverMiddleware"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { itemsTable } from "../drizzle/schema"
import { itemSchema, itemsSchema } from "../lib/zodSchema"
import { ItemInput } from "../utils/types"


//--------------------------------------------------------------------------------------------------------------------
interface Request_CreateItems {
  params: [companyID: string, items: ItemInput[]],
}

export const SA_CreateItems = createServerAction(
  isLogged,
  hasSubPermissionMiddleware("item", "create"),
  hasPermissionMiddleware("item", "create"),
  resolverMiddleware(itemsSchema, async (params) => params[1]),
  async ({ params }: Request_CreateItems) => {
    const [companyID, items] = params
    await db.insert(itemsTable).values(items.map(item => ({ ...item, companyID })))
    revalidatePath('/dashboard/items', "page")
    return createServerActionResponse()
  })

//--------------------------------------------------------------------------------------------------------------------
interface Request_DeleteItems {
  params: [itemID: string],
}

export const SA_DeleteItems = createServerAction(
  isLogged,
  hasSubPermissionMiddleware("item", "delete"),
  hasPermissionMiddleware("item", "delete"),
  async ({ params }: Request_DeleteItems) => {
    const [itemID] = params
    await db.delete(itemsTable).where(eq(itemsTable.id, itemID))
    revalidatePath('/dashboard/items', "page")
    return createServerActionResponse()
  })

//--------------------------------------------------------------------------------------------------------------------
interface Request_EditItem {
  params: [itemID: string, item: ItemInput],
}

export const SA_EditItem = createServerAction
  (isLogged,
    hasSubPermissionMiddleware("item", "update"),
    hasPermissionMiddleware("item", "update"),
    resolverMiddleware(itemSchema, async (params) => params[1]),
    async ({ params }: Request_EditItem) => {
      const [itemID, item] = params
      await db.update(itemsTable).set(item).where(eq(itemsTable.id, itemID))
      revalidatePath('/dashboard/items', "page")
      return createServerActionResponse()
    })




