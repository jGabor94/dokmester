"use server"

import { isLogged } from "@/features/authentication/utils";
import { hasPermissionMiddleware } from "@/features/authorization/utils";
import { createServerAction } from "@/lib/serverAction/createServerAction";
import { createServerActionResponse } from "@/lib/serverAction/response";
import { Session } from "next-auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

interface Request {
  session: Session
}

const SA_SetupIntent = createServerAction(isLogged, hasPermissionMiddleware("subscription", "update"), async ({ session }: Request) => {
  const customerID = session.user.customerID as string

  const setupIntent = await stripe.setupIntents.create({
    customer: customerID,
    payment_method_types: ['card'],
    usage: 'off_session',
  });

  return createServerActionResponse({ payload: { clientSecret: setupIntent.client_secret } })
})

export default SA_SetupIntent