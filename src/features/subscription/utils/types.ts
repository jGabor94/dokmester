import Stripe from "stripe";
import { getPaymentMethods, getSubscriptionDetails } from "../queries";

export type Plan = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  interval: Stripe.Price.Recurring.Interval | undefined;
  price_id: string;
}

export type PlanConfig = {
  name: string;
  storage: number;
  userNumber: number;
}

export type SubscriptionDetail = NonNullable<Awaited<ReturnType<typeof getSubscriptionDetails>>>
export type Pm = NonNullable<Awaited<ReturnType<typeof getPaymentMethods>>>[0]
export type Feature = "business" | "premium" | "basic"