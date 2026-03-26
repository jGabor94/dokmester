"use client"

import SA_UpdateSubscription from '@/features/subscription/actions/updateSubscription'
import { Plan } from '@/features/subscription/utils/types'
import { FC } from 'react'
import PlanSelectorSheet from './PlanSelectorSheet'

const UpdateSubscription: FC<{ plans: Plan[], existPlanID: string, subID: string }> = ({ plans, existPlanID, subID }) => {

  const updateSubscription = async (selectedPlan: string) => {
    await SA_UpdateSubscription(subID, selectedPlan)
  }

  return (
    <PlanSelectorSheet plans={plans} existPlanID={existPlanID} onSubmit={updateSubscription} label="Előfizetés Módosítása" />

  )
}

export default UpdateSubscription