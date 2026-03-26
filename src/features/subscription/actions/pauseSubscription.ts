
"use server"

import { isLogged } from "@/features/authentication/utils";
import { hasPermissionMiddleware } from "@/features/authorization/utils";
import { createServerAction } from "@/lib/serverAction/createServerAction";
import { createServerActionResponse } from "@/lib/serverAction/response";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

interface Request {
  params: [subID: string],
}

const SA_PauseSubscription = createServerAction(isLogged, hasPermissionMiddleware("subscription", "update"), async ({ params }: Request) => {
  const [subID] = params
  await stripe.subscriptions.update(subID, {
    pause_collection: { behavior: 'mark_uncollectible' },
  });
  return createServerActionResponse()
})

export default SA_PauseSubscription