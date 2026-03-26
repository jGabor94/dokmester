import Stripe from "stripe";
import { Plan } from "../utils/types";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

export const getCheckoutSession = async (sessionID: string) => {
  const { customer, metadata, status } = await stripe.checkout.sessions.retrieve(sessionID);
  return {
    status,
    customerID: typeof customer === "string" ? customer : customer?.id,
    planID: metadata?.planID
  }
}

export const getPaymentMethods = async (customerID: string) => {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerID,
    type: 'card'
  })
  return paymentMethods.data.map((pm) => ({
    id: pm.id,
    brand: pm.card?.brand,
    last4: pm.card?.last4,
    expMonth: pm.card?.exp_month,
    expYear: pm.card?.exp_year,
    //isDefault: pm.id === subscription.default_payment_method,
  }))
}

export const getPlans = async () => {

  const stripe = new Stripe(process.env.STRIPE_SECRET as string, {});

  const prices = await stripe.prices.list({
    expand: ['data.product'],
    active: true,
    type: 'recurring',
  });

  return prices.data.reduce((acc, price) => {

    if (typeof price.product === 'object' && 'name' in price.product) {

      return [...acc, {
        id: price.id,
        name: price.product.name,
        description: price.product.description,
        price: price.unit_amount,
        interval: price.recurring?.interval,
        price_id: price.id,
      }]
    }

    return [...acc]


  }, [] as Plan[]);

}


export const getSubscriptionDetails = async (customerID: string) => {

  const subscriptionList = await stripe.subscriptions.list({ customer: customerID, limit: 1 });

  if (subscriptionList.data.length === 0) return null

  let upcomingInvoice = null

  try {
    upcomingInvoice = await stripe.invoices.retrieveUpcoming({
      customer: customerID,
    });


  } catch (err) { }

  const subscription = subscriptionList.data[0]
  const plan = subscription.items.data[0].plan
  const product = (plan.product && await stripe.products.retrieve(typeof plan.product === "string" ? plan.product : plan.product.id)) as Stripe.Response<Stripe.Product>

  const productFeatures = (plan.product && await stripe.products.listFeatures(
    typeof plan.product === "string" ? plan.product : plan.product.id, { limit: 1 }
  )) as Stripe.Response<Stripe.ApiList<Stripe.ProductFeature>>


  return {
    feature: {
      id: productFeatures.data[0].entitlement_feature.id,
      name: productFeatures.data[0].entitlement_feature.lookup_key,
    },
    product: {
      id: product.id,
      name: product.name,
      image: product.images[0]
    },
    subID: subscription.id,
    status: subscription.status,
    planID: subscription.items.data[0].plan.id,
    startDate: subscription.start_date,
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end,
    cancelAt: subscription.cancel_at,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    billigCycle: subscription.billing_cycle_anchor,
    latestInvoice: subscription.latest_invoice ? typeof subscription.latest_invoice === "string" ? subscription.latest_invoice : subscription.latest_invoice.id : null,
    defaultPaymentMethod: typeof subscription.default_payment_method === "string" ? subscription.default_payment_method : subscription.default_payment_method?.id,
    upcomingInvoice: upcomingInvoice ? {
      total: upcomingInvoice.amount_due,
      currency: upcomingInvoice.currency,
      nextPaymentAttempt: upcomingInvoice.next_payment_attempt,
    } : null,
  }
}
