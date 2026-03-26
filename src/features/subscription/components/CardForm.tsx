"use client"

import { Button } from '@/components/ui/btn';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { FC, FormEventHandler, useState } from 'react';
import toast from 'react-hot-toast';
import { default as SA_SetupIntent } from '../actions/setupIntent';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const CardForm: FC<{}> = () => (
  <Elements stripe={stripePromise}>
    <CardFormCore />
  </Elements>
)


const CardFormCore: FC<{}> = () => {

  const [loading, setLoading] = useState(false)
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) return
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return

    setLoading(true)

    const res = await SA_SetupIntent()

    if (res.statusCode === 200 && res.payload.clientSecret) {

      const { error } = await stripe.confirmCardSetup(res.payload.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error?.message) {
        toast.error(error.message)
      } else {
        cardElement.clear()
        toast.success('Kártya sikeresen mentve')
        router.refresh()
      }
    } else {
      toast.error(res.statusMessage)
    }

    setLoading(false);

  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-4'>
        <CardElement options={{ hidePostalCode: true }} />
        <Button type="submit" loading={loading} disabled={!stripe || loading} >
          Kártya hozzáadása
        </Button>
      </div>

    </form>
  )
}

export default CardForm