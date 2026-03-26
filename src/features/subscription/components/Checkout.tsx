"use client"

import SA_CreateCheckoutSession from '@/features/subscription/actions/createCheckoutSession'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { FC } from 'react'
import Stripe from 'stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const Checkout: FC<{
  planID: string,
  customerID: string,
  returnPath: string,
  mode: Stripe.Checkout.SessionCreateParams.Mode
}> = ({ planID, customerID, returnPath, mode }) => {

  const fetchClientSecret = async () => {
    const res = await SA_CreateCheckoutSession(planID, customerID, returnPath, mode)
    return res.payload?.clientSecret || ""
  }

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ fetchClientSecret }}
      
    >
      <EmbeddedCheckout className={`w-full`}/>
    </EmbeddedCheckoutProvider>
  )
}


export default Checkout