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
  params: [subID: string, newPriceID: string],
  session: Session
}

const SA_UpdateSubscription = createServerAction(isLogged, hasPermissionMiddleware("subscription", "update"), async ({ params, session }: Request) => {

  const [subID, newPriceID] = params

  const subItemID = (await stripe.subscriptions.retrieve(subID)).items.data[0].id
  await stripe.subscriptionItems.update(subItemID, {
    price: newPriceID
  })

  revalidatePath("/dashboard/options/subscription", "page")

  return createServerActionResponse()

})



export default SA_UpdateSubscription