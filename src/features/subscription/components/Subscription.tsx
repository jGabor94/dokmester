import Tag from '@/components/ui/Tag'
import { auth } from '@/features/authentication/lib/auth'
import Invoice from '@/features/subscription/components/Invoice'
import { db } from '@/lib/drizzle/db'
import { subscriptionsTable } from '@/lib/drizzle/schema'
import { getDate, HUF } from '@/lib/utils'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { FC, Suspense } from 'react'
import Stripe from 'stripe'
import { getCheckoutSession, getPlans, getSubscriptionDetails } from '../queries'
import { resolveStatus } from '../utils'
import CancelSubscription from './CancelSubscription'
import CreateSubscription from './CreateSubscription'
import PaymentMethod from './PaymentMethod'
import ResumeSubscription from './ResumeSubscription'
import UpdateSubscription from './UpdateSubscription'
import UsedSpace from './UsedSpace'
import UsersNumber from './UsersNumber'

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

const Subscription: FC<{}> = async () => {

  const session = await auth();

  if (!session || !session.user.customerID) return redirect("/")

  const { csID } = await db.query.subscriptionsTable.findFirst({ where: eq(subscriptionsTable.customerID, session.user.customerID) }) || { csID: null }

  if (csID) {
    const csStatus = (await getCheckoutSession(csID)).status
    if (csStatus && csStatus === "open") {
      await stripe.checkout.sessions.expire(csID)
    }
  }

  const subscription = await getSubscriptionDetails(session.user.customerID);

  const plans = await getPlans();
  const tags = resolveStatus({ status: subscription?.status as string })

  return (
    <div className='relative grid grid-cols-1 gap-4'>
      {subscription ? (
        <>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">{subscription.product.name}</span>
            {!subscription.cancelAt ? (
              <Tag color={tags.color} >{tags.text}</Tag>
            ) : (
              <Tag color="disabled">Lemondva ekkor: {getDate(subscription.cancelAt * 1000)}</Tag>
            )}
          </div>
          {subscription.status === "incomplete" && subscription.latestInvoice && (
            <Invoice inID={subscription.latestInvoice} />
          )}
          <div className="flex flex-col border border-1  rounded-lg bg-card shadow-sm">
            <span className='py-2 px-4 font-semibold'>Részletek</span>
            <div className='h-[1px] bg-gray-200' />

            < div className="flex flex-col gap-4 text-sm p-4 " >
              {subscription.upcomingInvoice && subscription.upcomingInvoice.nextPaymentAttempt && (
                <div className="flex flex-col gap-1 ">
                  <span className="font-semibold">Következő fizetés</span>
                  <span className="text-zinc-600">{getDate(subscription.upcomingInvoice.nextPaymentAttempt * 1000)} | {HUF.format(subscription.upcomingInvoice.total / 100)}</span>
                </div>
              )}

              <div className="flex flex-col gap-1 ">
                <span className="font-semibold">Előfizetés kezdete</span>
                <span className="text-zinc-600">{getDate(subscription.currentPeriodStart * 1000)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">Jelenlegi periódus</span>
                <span className="text-zinc-600">{getDate(subscription.currentPeriodStart * 1000)} - {getDate(subscription.currentPeriodEnd * 1000)}</span>
              </div>
              {!subscription.cancelAtPeriodEnd && subscription.status !== 'canceled' ? (
                <CancelSubscription subID={subscription.subID} />
              ) : (
                <ResumeSubscription subID={subscription.subID} />
              )}
              <UpdateSubscription existPlanID={subscription.planID} plans={plans} subID={subscription.subID} />
            </div >

          </div >
          <div className="flex flex-col border border-1 rounded-lg bg-card shadow-sm">
            <span className='py-2 px-4 font-semibold'>Tárhely</span>
            <div className='h-[1px] bg-gray-200' />
            <Suspense >
              <UsedSpace feature={subscription.feature.name} />
            </Suspense>

          </div>
          <div className="flex flex-col border border-1 rounded-lg bg-card shadow-sm">
            <span className='py-2 px-4 font-semibold'>Felhasználók</span>
            <div className='h-[1px] bg-gray-200' />
            <Suspense >
              <UsersNumber feature={subscription.feature.name} />
            </Suspense>
          </div>

        </>


      ) : (
        <CreateSubscription {...{ plans, customerID: session.user.customerID }} />
      )}
      <div className="flex flex-col border border-1 rounded-lg bg-card shadow-sm">
        <span className='py-2 px-4 font-semibold'>Fizetési módok</span>
        <div className='h-[1px] bg-gray-200' />
        <Suspense >
          <PaymentMethod subID={subscription?.subID} defaultPaymentMethod={subscription?.defaultPaymentMethod} />
        </Suspense>
      </div>

    </div>
  )

}

export default Subscription