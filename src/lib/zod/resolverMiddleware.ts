import { z } from "zod"
import { Next } from "../serverAction/createServerAction/types"
import { createServerActionResponse } from "../serverAction/response"

export const resolverMiddleware = (schema: z.Schema, cb: (params: any[]) => any) => async (next: Next, req: { params: any[] }) => {

  const data = await cb(req.params)
  const result = schema.safeParse(data)

  if (result.success) {
    return next()
  } else {
    return createServerActionResponse({ status: 400, error: result.error.format() })
  }

}