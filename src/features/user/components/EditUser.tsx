'use client'

import { Button } from "@/components/ui/btn"
import { Input } from "@/components/ui/inpt"
import { PhoneInput } from "@/components/ui/phoneNumberInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { SaveIcon } from "lucide-react"
import { FC } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { SA_UpdateUser } from "../actions/actions"
import { editUserFormSchema } from "../lib/zodSchema"
import { EditUserInputs, User } from "../utils/types"

const EditCompany: FC<{ user: User }> = ({ user }) => {



  const form = useForm<EditUserInputs>({
    mode: "all",
    defaultValues: {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    },
    resolver: zodResolver(editUserFormSchema)
  })

  const onSubmit: SubmitHandler<EditUserInputs> = async (data) => {

    const res = await SA_UpdateUser({ ...data })

    if (res.statusCode === 200) {
      toast.success('Személyes adatok frissítve!');
    } else if (res.statusCode === 400) {
      toast.error("Hibás adatok!");
    } else {
      toast.error(res.statusMessage);
    }
  }



  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={`flex flex-col gap-4`}>
          <div>
            <label htmlFor={`name`} className={`mb-1 text-xs`}>Teljes név</label>
            <Input type="text" id="name" {...form.register("name")} placeholder={`Teljes név`} className={`w-full`} />
          </div>
          <div>
            <label htmlFor={`mobile`} className={`mb-1 text-xs`}>Telefonszám</label>
            <Controller
              control={form.control}
              name="mobile"
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  defaultCountry='HU'
                  onChange={onChange}
                  value={value}
                  id={`mobile`}
                />
              )}
            />
          </div>
          <div>
            <label htmlFor={`email`} className={`block mb-1 text-xs`}>E-mail cím</label>
            <Input type="email" id="email" {...form.register("email")} placeholder={`E-mail cím`} className={`w-full`} disabled={true} />
          </div>
          <Button type={`submit`} className="w-full" variant="outline" loading={form.formState.isSubmitting} disabled={!form.formState.isValid || form.formState.isSubmitting}>
            <SaveIcon />
            Mentés
          </Button>
        </div>
      </form >
    </>
  )
}

export default EditCompany