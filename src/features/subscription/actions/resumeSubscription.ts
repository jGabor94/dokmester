"use server"

import { isLogged } from "@/features/authentication/utils";
import { hasPermissionMiddleware } from "@/features/authorization/utils";
import { createServerAction } from "@/lib/serverAction/createServerAction";
import { createServerActionResponse } from "@/lib/serverAction/response";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

interface Request {
  params: [subID: string],
}

const SA_ResumeSubscription = createServerAction(isLogged, hasPermissionMiddleware("subscription", "update"), async ({ params }: Request) => {
  const [subID] = params
  await stripe.subscriptions.update(subID, { cancel_at_period_end: false })
  revalidatePath("/dashboard/options/subscription", "page")
  return createServerActionResponse()
})

export default SA_ResumeSubscription