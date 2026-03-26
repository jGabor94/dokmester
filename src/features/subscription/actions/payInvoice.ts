"use server"

import { isLogged } from "@/features/authentication/utils";
import { hasPermissionMiddleware } from "@/features/authorization/utils";
import { createServerAction } from "@/lib/serverAction/createServerAction";
import { createServerActionResponse } from "@/lib/serverAction/response";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

interface Request {
  params: [inID: string],
}

const SA_PayInvoice = createServerAction(isLogged, hasPermissionMiddleware("subscription", "pay"), async ({ params }: Request) => {
  const [inID] = params
  await stripe.invoices.pay(inID);
  revalidatePath("/dashboard/options/subscription", "page")

  return createServerActionResponse()
})

export default SA_PayInvoice