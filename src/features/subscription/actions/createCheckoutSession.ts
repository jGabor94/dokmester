"use server"

import { db } from "@/lib/drizzle/db";
import { createServerAction } from "@/lib/serverAction/createServerAction";
import { createServerActionResponse } from "@/lib/serverAction/response";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { subscriptionsTable } from "../drizzle/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);


interface Request {
  params: [planID: string, customerID: string, returnPath: string, mode: Stripe.Checkout.SessionCreateParams.Mode],
}


const SA_CreateCheckoutSession = createServerAction(async ({ params }: Request) => {

  const [plandID, customerID, returnPath, mode] = params

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    ui_mode: 'embedded',
    mode,
    subscription_data: {

    },
    line_items: [
      {
        price: plandID,
        quantity: 1
      }
    ],
    return_url: `${process.env.BASE_URL}${returnPath}`,
    customer: customerID,
    metadata: {
      planID: plandID
    }
  });

  await db.update(subscriptionsTable).set({ csID: session.id }).where(eq(subscriptionsTable.customerID, customerID))

  return createServerActionResponse({ payload: { clientSecret: session.client_secret } })

})



export default SA_CreateCheckoutSession