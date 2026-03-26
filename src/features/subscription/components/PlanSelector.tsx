"use client"

import { Plan } from '@/features/subscription/utils/types'
import { GemIcon, MonitorUpIcon, RocketIcon } from 'lucide-react'
import { FC } from 'react'

const PlanSelector: FC<{ plans: Plan[], onChange: (planID: string) => void, selectedPlan?: string }> = ({ plans, onChange, selectedPlan }) => {
  return (
    <div className='flex flex-col gap-4'>
      {plans.map((plan, index) => (
        <div className={`flex justify-start items-center gap-3 cursor-pointer px-3 py-2 border border-1 rounded-lg text-muted-foreground ${index == 0 ? 'border-violet-500 bg-violet-500/5' : index == 1 ? 'bg-primary/5 border-primary' : 'bg-amber-500/5 border-amber-500'} ${plan.id === selectedPlan && "border-2 text-slate-950"}`} key={plan.id} onClick={() => onChange(plan.id)} >
          <div>
            {index == 0 ? (
              <GemIcon className={`text-violet-500`} strokeWidth={1.5} />
            ) : (
              <>
                {index == 1 ? (
                  <RocketIcon className={`text-primary`} strokeWidth={1.5} />
                ) : (
                  <MonitorUpIcon className={`text-amber-500`} strokeWidth={1.5} />
                )}
              </>
            )}
          </div>
          <div>
            <h3 className={`font-bold`}>{plan.name}</h3>
            <p>{plan.price && new Intl.NumberFormat("hu-HU", { style: 'currency', currency: 'HUF', maximumSignificantDigits: 5 }).format(plan.price / 100)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlanSelector