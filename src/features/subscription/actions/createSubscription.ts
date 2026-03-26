"use server"

import { isLogged } from "@/features/authentication/utils";
import { hasPermissionMiddleware } from "@/features/authorization/utils";
import { createServerAction } from "@/lib/serverAction/createServerAction";
import { createServerActionResponse } from "@/lib/serverAction/response";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

interface Request {
  params: [planID: string],
  session: Session
}

const SA_CreateSubscription = createServerAction(isLogged, hasPermissionMiddleware("subscription", "create"), async ({ params, session }: Request) => {
  const [price] = params
  const customerID = session.user.customerID as string

  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerID,
    type: 'card',
  });


  if (paymentMethods.data.length === 0) {
    return createServerActionResponse({ status: 400, message: "No payment method" })
  }

  await stripe.subscriptions.create({
    customer: customerID,
    items: [{ price }],
    default_payment_method: paymentMethods.data[0].id,
    automatic_tax: {
      enabled: true
    }
  });

  revalidatePath("/dashboard/options/subscription", "page")

  return createServerActionResponse()
})

export default SA_CreateSubscription