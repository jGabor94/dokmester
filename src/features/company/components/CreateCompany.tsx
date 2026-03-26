"use client"

import { SA_CreateCompany, SA_IsCompanyExist } from '@/features/company/actions'
import CompanyForm from '@/features/company/components/CompanyForm'
import { CompanyInputs, CreateCompanyForm } from '@/features/company/utils/types'
import Checkout from '@/features/subscription/components/Checkout'
import PlanForm from '@/features/subscription/components/PlanForm'
import { Plan } from '@/features/subscription/utils/types'
import { FC, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'

const Register: FC<{ plans: Plan[] }> = ({ plans }) => {

  const [page, setPage] = useState(1)

  const [submitValues, setSubmitValues] = useState<CreateCompanyForm>({
    company: {
      name: "",
      taxnumber: "",
      zip: 0,
      city: "",
      address: "",
      color: '#13a4ec',
    },
    customerID: "",
    planID: plans[1].id,
  }
  )

  const companySubmit: SubmitHandler<CompanyInputs> = async (data) => {

    const res = await SA_IsCompanyExist(data.taxnumber)

    if (res.statusCode === 200) {
      if (res.payload.exist) {
        toast.error("Ez a cég már regisztrálva van a rendszerbe!")
      } else {
        setSubmitValues(state => ({ ...state, company: data }))
        setPage(2)
      }
    } else {
      toast.error(res.statusMessage);
    }

  }

  const planSubmit = async (planID: string) => {
    const res = await SA_CreateCompany({ ...submitValues, planID })
    if (res.statusCode === 200) {
      setSubmitValues({ ...submitValues, planID, customerID: res.payload.customerID })
      setPage(3)
    } else if (res.statusCode === 400) {
      toast.error("Hibás adatok!");
    } else if (res.statusCode === 409) {
      toast.error(res.error);
    } else {
      toast.error(res.statusMessage);
    }
  }

  return (
    <>
      <div className={`grid gap-4 border shadow-sm p-3 bg-card rounded-2xl w-full mx-auto ${page !== 3 ? 'max-w-md' : 'max-w-xl md:mt-24 mb-4'}`}>
        <div className={`flex justify-between items-center`}>
          <h1 className={`text-2xl font-bold`}>Cég hozzáadása</h1>
          <p className={`text-lg text-muted-foreground`}>{page} / 3</p>
        </div>
        {page === 1 && <CompanyForm defaultValues={submitValues.company} onSubmit={companySubmit} buttonTitle='Tovább' />}
        {page === 2 && <PlanForm {...{ setPage, plans, onSubmit: planSubmit, initPlanID: submitValues.planID, submitTitle: "Létrehozás" }} />}
        {page === 3 && <Checkout planID={submitValues.planID} customerID={submitValues.customerID} returnPath={`/session/check?session_id={CHECKOUT_SESSION_ID}`} mode="subscription" />}
      </div>
    </>
  )
}

export default Register