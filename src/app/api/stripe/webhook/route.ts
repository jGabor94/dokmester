import { getCompanyByCustomer } from '@/features/company/queries/getCompany';
import { szamlazzHu } from '@/features/documents/utils/server/szamlazzHu';
import { subscriptionsTable } from '@/features/subscription/drizzle/schema';
import { Feature } from '@/features/subscription/utils/types';
import { getUserByEmail } from '@/features/user/queries';
import { db } from '@/lib/drizzle/db';
import { createClient } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET!);

export async function POST(request: NextRequest) {

  const body = await request.text();
  const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
  const headersList = await headers()
  const sig = headersList.get('stripe-signature') as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, {
      status: 400
    });
  }

  try {

    if (event.type === "entitlements.active_entitlement_summary.updated") {
      const { customer, entitlements } = event.data.object
      const [entitlement] = entitlements.data
      entitlement.lookup_key
      await db.update(subscriptionsTable).set({ feature: entitlement.lookup_key as Feature }).where(eq(subscriptionsTable.customerID, customer))
      return new Response('Entitlements updated', {
        status: 200
      });
    }

    if (event.type === "invoice.payment_succeeded") {

      const invoice = event.data.object


      if (!invoice.customer || !invoice.customer_email) return new Response(`Webhook Error: missing customer informations`, {
        status: 400
      });

      const customerID = typeof invoice.customer === "string" ? invoice.customer : invoice.customer.id

      const company = await getCompanyByCustomer(customerID)
      const user = await getUserByEmail(invoice.customer_email)

      if (!company) return new Response(`Webhook Error: company not found`, {
        status: 400
      });

      if (!user) return new Response(`Webhook Error: user not found`, {
        status: 400
      });

      try {
        const res = await szamlazzHu({
          config: {
            id: invoice.id,
            eInvoice: true,
            invoiceDownload: true,
          },
          header: {
            completionDate: new Date().toISOString().split("T")[0],
            dueDate: new Date().toISOString().split("T")[0],
          },
          customer: {
            name: company.name,
            zip: company.zip,
            city: company.city,
            address: company.address,
            taxnumber: company.taxnumber,
            email: invoice.customer_email,
            phoneNumber: user.mobile,
            comment: "A számla végösszege kiegyenlítésre került.",
            sendEmail: true

          },
          items: invoice.lines.data.map(line => ({
            name: line.description as string,
            unitPrice: line.amount_excluding_tax as number / 100,
            vatAmount: line.tax_amounts[0].amount as number / 100,
            grossAmount: line.amount as number / 100,
            unit: "db",
            quantity: line.quantity as number,
            vatkey: 27
          }))
        })

        const supabase = createClient(process.env.SUPABASE_PROJECT_URL as string, process.env.SUPABASE_API_KEY as string)


        const { error } = await supabase.storage.from(`documents`).upload(`invoices/${invoice.id}.pdf`, await res.arrayBuffer())
        if (error) {
          console.log(error)
          throw error
        }

        return new Response('Invoice created', {
          status: 200
        });
      } catch (err) {
        return new Response(`Webhook Error: szamlazz.hu error`, {
          status: 409
        });
      }



    }

    if (event.type === "customer.subscription.deleted") {
      const { customer } = event.data.object
      const customerID = typeof customer === "string" ? customer : customer.id
      await db.update(subscriptionsTable).set({ subID: null }).where(eq(subscriptionsTable.customerID, customerID))
      return new Response('Subscription deleted', {
        status: 200
      });
    }

    if (event.type === "customer.subscription.created") {
      const { customer, id: subID } = event.data.object
      const customerID = typeof customer === "string" ? customer : customer.id
      await db.update(subscriptionsTable).set({ subID }).where(eq(subscriptionsTable.customerID, customerID))
      return new Response('Subscription created', {
        status: 200
      });
    }

    if (event.type === 'checkout.session.expired') {
      const { customer } = event.data.object
      if (!customer) throw new Error()
      const customerID = typeof customer === "string" ? customer : customer.id
      await db.update(subscriptionsTable).set({ subID: null, csID: null }).where(eq(subscriptionsTable.customerID, customerID))
      return new Response('Checkout expired', {
        status: 200
      });
    }

    if (event.type !== 'checkout.session.completed') throw new Error()
    const { customer } = event.data.object
    if (!customer) throw new Error()
    const customerID = typeof customer === "string" ? customer : customer.id
    await db.update(subscriptionsTable).set({ csID: null }).where(eq(subscriptionsTable.customerID, customerID))
    return new Response('Subscription completed', {
      status: 200
    });

  } catch (err) {
    return new Response('Server error', {
      status: 500
    });
  }


}