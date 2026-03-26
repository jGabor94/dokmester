"use client"

import { Button } from '@/components/ui/btn'
import PlanSelector from '@/features/subscription/components/PlanSelector'
import { Plan } from '@/features/subscription/utils/types'
import { Dispatch, FC, SetStateAction, useState } from 'react'

const PlanForm: FC<{
  setPage: Dispatch<SetStateAction<number>>,
  initPlanID: string,
  plans: Plan[],
  onSubmit: (planID: string) => void,
  submitTitle: string
}> = ({ setPage, initPlanID, onSubmit, plans, submitTitle }) => {

  const [selectedPlan, setSelectedPlan] = useState(initPlanID)

  const handleClick = async () => {
    onSubmit(selectedPlan)
  }

  const handlePlanChange = (planID: string) => {
    setSelectedPlan(planID)
  }

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <p className={`block mb-1 text-xs`}>Válassz csomagot</p>
        <PlanSelector {...{ plans, onChange: handlePlanChange, selectedPlan }} />
      </div>
      <div className={`grid grid-cols-2 gap-4 justify-center items-center`}>
        <Button type="button" className={`block w-full min-w-full`} variant={'outline'} onClick={() => setPage(state => state - 1)}>Vissza</Button>
        <Button type="button" className={`block w-full min-w-full`} onClick={handleClick}>{submitTitle}</Button>
      </div>
    </div>
  )
}

export default PlanForm