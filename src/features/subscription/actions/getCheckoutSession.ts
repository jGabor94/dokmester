"use server"

import { createServerAction } from "@/lib/serverAction/createServerAction";
import { createServerActionResponse } from "@/lib/serverAction/response";
import { getCheckoutSession } from "../queries";

interface Request {
  params: [sessionID: string],
}

const SA_GetCheckoutSession = createServerAction(async ({ params }: Request) => {

  const [sessionID] = params
  const session = await getCheckoutSession(sessionID);

  return createServerActionResponse({ payload: session })
})

export default SA_GetCheckoutSession