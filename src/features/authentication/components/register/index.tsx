"use client"

import { SA_IsCompanyExist } from '@/features/company/actions'
import CompanyForm from '@/features/company/components/CompanyForm'
import { CompanyInputs } from '@/features/company/utils/types'
import Checkout from '@/features/subscription/components/Checkout'
import PlanForm from '@/features/subscription/components/PlanForm'
import { Plan } from '@/features/subscription/utils/types'
import { FC, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import { SA_SignUp } from '../../actions'
import { RegisterForm } from '../../utils/types'
import EmailVerifyForm from './EmailVerifyForm'
import UserForm from './UserForm'


const Register: FC<{ plans: Plan[] }> = ({ plans }) => {

  const [page, setPage] = useState(1)

  const [submitValues, setSubmitValues] = useState<RegisterForm>({
    company: {
      name: "",
      taxnumber: "",
      zip: 0,
      countryCode: "HU",
      city: "",
      address: "",
      color: '#13a4ec',
    },
    user: {
      name: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    customerID: "",
    planID: plans[1].id,
    verified: false
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
    setSubmitValues({ ...submitValues, planID })
    const res = await SA_SignUp(submitValues)
    if (res.statusCode === 200) {
      setSubmitValues({ ...submitValues, customerID: res.payload.customerID })
      setPage(5)
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
      <div className={`grid gap-4 border shadow-sm p-3 bg-card rounded-2xl w-full mx-auto ${page !== 5 ? 'max-w-md' : 'max-w-xl md:mt-24 mb-4'}`}>
        <div className={`flex justify-between items-center`}>
          <h1 className={`text-2xl font-bold`}>Regisztráció</h1>
          <p className={`text-lg text-muted-foreground`}>{page} / 5</p>
        </div>
        {page === 1 && <CompanyForm defaultValues={submitValues.company} onSubmit={companySubmit} buttonTitle='Tovább' />}
        {page === 2 && <UserForm {...{ setPage, setSubmitValues, submitValues }} />}
        {page === 3 && <EmailVerifyForm {...{ setPage, submitValues }} />}
        {page === 4 && <PlanForm {...{ setPage, plans, onSubmit: planSubmit, initPlanID: submitValues.planID, submitTitle: "Regisztráció" }} />}
        {page === 5 && <Checkout planID={submitValues.planID} customerID={submitValues.customerID} returnPath={`/session/check?session_id={CHECKOUT_SESSION_ID}`} mode="subscription" />}
      </div>
    </>
  )
}

export default Register