"use client"

import SA_CreateSubscription from "@/features/subscription/actions/createSubscription";
import Checkout from "@/features/subscription/components/Checkout";
import { Plan } from "@/features/subscription/utils/types";
import { FC, useState } from 'react';
import PlanSelectorSheet from "./PlanSelectorSheet";

const CreateSubscription: FC<{ plans: Plan[], customerID: string }> = ({ plans, customerID }) => {

  const [checkout, setCheckout] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<null | string>(null)

  const submitPlanChange = async (selectedPlan: string) => {
    const res = await SA_CreateSubscription(selectedPlan)

    if (res.statusCode === 400) {
      setSelectedPlan(selectedPlan)
      setCheckout(true)
    }
  }

  if (checkout && selectedPlan) return <Checkout
    planID={selectedPlan} customerID={customerID} returnPath={`/dashboard/options/subscription?session_id={CHECKOUT_SESSION_ID}`} mode="subscription"
  />

  return (
    <div>
      <PlanSelectorSheet plans={plans} onSubmit={submitPlanChange} label="Csomag kiválasztása" />
    </div>
  )


}

export default CreateSubscription