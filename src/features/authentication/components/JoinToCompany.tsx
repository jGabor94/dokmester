"use client"

import { Button } from '@/components/ui/btn'
import { Input } from '@/components/ui/inpt'
import { PhoneInput } from '@/components/ui/phoneNumberInput'
import { registerUserFormSchema } from '@/features/user/lib/zodSchema'
import { RegisterUserInputs, SelectInvite } from '@/features/user/utils/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Success from '../../../components/Success'
import { SA_JoinToCompany } from '../actions'

const JoinToCompany: FC<{ invite: SelectInvite }> = ({ invite }) => {

  const [success, setSuccess] = useState(false)


  const form = useForm({
    mode: "all",
    defaultValues: {
      name: "",
      password: "",
      email: invite.email,
      mobile: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerUserFormSchema)
  })

  const onSubmit: SubmitHandler<RegisterUserInputs> = async (data) => {
    const res = await SA_JoinToCompany(data, invite.id)
    if (res.statusCode === 200) {
      setSuccess(true)
    } else if (res.statusCode === 400) {
      toast.error("Hibás adatok!");
    } else if (res.statusCode === 409) {
      toast.error(res.error);
    } else {
      toast.error(res.statusMessage);
    }
  }

  if (success) return <Success title="Sikeresen csatlakoztál!" />


  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className='flex flex-col gap-4'>
        <div>
          <label htmlFor={`name`} className={`block mb-1 text-xs`}>Teljes név</label>
          <Input type="text" id="name" {...form.register("name")} placeholder={`Teljes név`} />
        </div>
        <div>
          <label htmlFor={`mobile`} className={`block mb-1 text-xs`}>Telefonszám</label>
          <Controller
            control={form.control}
            name="mobile"
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                defaultCountry='HU'
                onChange={onChange}
                value={value}
                placeholder='301234567'
              />
            )}
          />
        </div>
        <div>
          <label htmlFor={`email`} className={`block mb-1 text-xs`}>E-mail cím</label>
          <Input type="email" id="email" {...form.register("email")} disabled placeholder={`regisztralok@dokmester.com`} />
        </div>
        <div>
          <label htmlFor={`password`} className={`block mb-1 text-xs`}>Jelszó</label>
          <Input type="password" id="password" {...form.register("password")} placeholder={`Jelszó`} />
        </div>
        <div>
          <label htmlFor={`password`} className={`block mb-1 text-xs`}>Jelszó megerősítése</label>
          <Input type="password" id="password" {...form.register("confirmPassword")} placeholder={`Jelszó`} />
        </div>
        <Button type="submit" disabled={!form.formState.isValid} className='w-full'>Csatlakozás</Button>
      </div>
    </form>
  )
}

export default JoinToCompany