"use client"

import { Button } from '@/components/ui/btn'
import { Input } from '@/components/ui/inpt'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { SA_PasswordChange } from '../actions/actions'
import { passwordChangeSchema } from '../lib/zodSchema'
import { PasswordChangeInputs } from '../utils/types'

const PasswordChange: FC<{}> = () => {

  const form = useForm<PasswordChangeInputs>({
    resolver: zodResolver(passwordChangeSchema),
  })

  const onSubmit: SubmitHandler<PasswordChangeInputs> = async (data) => {
    const res = await SA_PasswordChange(data)

    if (res.statusCode === 200) {
      toast.success("Jelszó sikeresen módosítva");
      form.reset()
    } else if (res.statusCode === 400) {
      if (typeof res.error === "string")
        toast.error(res.error);
    } else {
      toast.error(res.statusMessage);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className={`flex flex-col gap-4`}>
        <div>
          <label htmlFor={`currentPassword`} className={`mb-1 text-xs`}>Jelenlegi jelszó</label>
          <Input type="password" id="currentPassword" {...form.register("currentPassword")} placeholder={`Jelenlegi jelszó`} />
        </div>
        <div>
          <label htmlFor={`password`} className={`block mb-1 text-xs`}>Új jelszó</label>
          <Input type="password" id="password" {...form.register("password")} placeholder={`Új jelszó`} />
        </div>
        <div>
          <label htmlFor={`confirmPassword`} className={`block mb-1 text-xs`}>Megerősítő jelszó</label>
          <Input type="password" id="confirmPassword" {...form.register("confirmPassword")} placeholder={`Megerősítő jelszó`} />
        </div>
        <Button type={`submit`} className="w-full" variant="outline" loading={form.formState.isSubmitting} disabled={!form.formState.isValid || form.formState.isSubmitting}>

          Jelszó módosítása
        </Button>
      </div>
    </form >
  )
}

export default PasswordChange