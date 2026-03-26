"use server"

import { isLogged } from "@/features/authentication/utils";
import { hasPermissionMiddleware } from "@/features/authorization/utils";
import { createServerAction } from "@/lib/serverAction/createServerAction";
import { createServerActionResponse } from "@/lib/serverAction/response";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

interface Request {
  params: [pm: string],
}

const SA_DeletePaymentMethod = createServerAction(isLogged, hasPermissionMiddleware("subscription", "update"), async ({ params }: Request) => {
  const [pm] = params
  await stripe.paymentMethods.detach(pm);
  revalidatePath("/dashboard/options/subscription", "page")
  return createServerActionResponse()
})

export default SA_DeletePaymentMethod