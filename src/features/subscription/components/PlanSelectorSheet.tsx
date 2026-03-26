import { Button } from "@/components/ui/btn";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Plan } from "@/features/subscription/utils/types";
import { FC, useState } from 'react';
import PlanSelector from "./PlanSelector";

const PlanSelectorSheet: FC<{ plans: Plan[], existPlanID?: string, onSubmit: (selectedPlan: string) => Promise<void>, label: string }> = ({ plans, existPlanID, onSubmit, label }) => {

  const [selectedPlan, setSelectedPlan] = useState(existPlanID || plans[1].id)
  const [loading, setLoading] = useState(false)

  const submitPlanChange = async () => {
    setLoading(true)
    if (existPlanID !== selectedPlan) {
      await onSubmit(selectedPlan)
    }
    setLoading(false)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button loading={loading} disabled={loading}>{label}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Csomagok</SheetTitle>
          <SheetDescription>
            Válassz csomagot
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 mb-4">
          <PlanSelector {...{ plans, onChange: (planID) => setSelectedPlan(planID), selectedPlan }} />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={submitPlanChange} disabled={existPlanID === selectedPlan || loading}>Váltás</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>

  )
}

export default PlanSelectorSheet