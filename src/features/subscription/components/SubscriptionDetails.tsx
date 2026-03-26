import Tag from "@/components/ui/Tag";
import { getDate, HUF } from "@/lib/utils";
import { FC } from "react";
import { Plan, SubscriptionDetail } from "../utils/types";
import CancelSubscription from "./CancelSubscription";
import Invoice from "./Invoice";
import ResumeSubscription from "./ResumeSubscription";
import UpdateSubscription from "./UpdateSubscription";


const SubscriptionDetails: FC<{ subscription: SubscriptionDetail, plans: Plan[] }> = ({ subscription, plans }) => {


  return (
    <div className=" flex flex-col gap-6 w-full">
      <div className="flex flex-row justify-between">
        <span className="text-3xl  font-bold">{subscription.feature.name}</span>
        <UpdateSubscription existPlanID={subscription.planID} plans={plans} subID={subscription.subID} />
      </div>

      < div className="flex flex-row gap-4" >
        <Tag color={subscription.status === "active" ? "success" : "warning"} >{subscription.status}</Tag>
        {subscription.cancelAt && <Tag color="disabled">Lemondva ekkor: {getDate(subscription.cancelAt * 1000)}</Tag>}
      </div >

      {subscription.status === "incomplete" && subscription.latestInvoice && (
        <Invoice inID={subscription.latestInvoice} />
      )}
      <div className="flex flex-col border border-1  rounded-lg">
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
        </div >
        {!subscription.cancelAtPeriodEnd && subscription.status !== 'canceled' ? (
          <CancelSubscription subID={subscription.subID} />
        ) : (
          <ResumeSubscription subID={subscription.subID} />
        )}
      </div >

    </div >







  )
}

export default SubscriptionDetails