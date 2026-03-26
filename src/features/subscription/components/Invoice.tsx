import { HUF } from '@/lib/utils';
import { AlertCircle } from "lucide-react";
import Link from 'next/link';
import { FC } from 'react';
import Stripe from 'stripe';
import PayInvoice from './PayInvoice';

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

const Invoice: FC<{ inID: string }> = async ({ inID }) => {

  const latestInvoice = await stripe.invoices.retrieve(inID);

  return (
    <div className="flex flex-col border border-1 rounded-lg border-orange-400">
      <div className='flex flex-row items-center py-2 px-4'>
        <AlertCircle />
        <span className='py-2 px-4 font-semibold'>Függő számla</span>

      </div>
      <div className="flex flex-row  text-sm justify-between p-4">
        <div className='flex flex-col gap-4'>
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Összeg</span>
            <span className="text-zinc-600">{HUF.format(latestInvoice.amount_due / 100)}</span>
          </div>
          {latestInvoice.hosted_invoice_url && (
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Részletek</span>
              <Link className="text-zinc-600" href={latestInvoice.hosted_invoice_url}>Link</Link>
            </div>
          )}
        </div>


        <PayInvoice inID={inID} className='w-fit self-end' />
      </div>
    </div>

  )
}

export default Invoice