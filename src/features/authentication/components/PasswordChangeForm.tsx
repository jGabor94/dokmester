"use client"

import { Button } from '@/components/ui/btn'
import { Input } from '@/components/ui/inpt'
import { confirmPasswordSchema } from '@/features/user/lib/zodSchema'
import { PasswordResetInputs } from '@/features/user/utils/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheckBig } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { SA_PasswordChange } from '../actions'

const PasswordChangeForm: FC<{ userID: string }> = ({ userID }) => {

  const router = useRouter();

  const form = useForm<PasswordResetInputs>({
    resolver: zodResolver(confirmPasswordSchema, {}),
  })

  const onSubmit: SubmitHandler<PasswordResetInputs> = async (data) => {

    const res = await SA_PasswordChange(data, userID);

    if (res.statusCode !== 200) {
      toast.error(res.statusMessage);
      throw new Error(res.statusMessage);
    }

  }

  if (form.formState.isSubmitSuccessful) return (
    <div className='flex flex-col items-center gap-4'>
      <p className='text-3xl'>Új jelszó beállítva!</p>
      <CircleCheckBig width={120} height={120} color="#00c853" />
      <Button onClick={() => router.push("/login")}>Bejelentkezés</Button>
    </div>
  )

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={`grid gap-4 border shadow-sm p-3 bg-card rounded-2xl max-w-md w-full mx-auto`}>
      <h1 className={`font-bold text-2xl`}>Új jelszó megadása</h1>
      <div>
        <label htmlFor={`password`} className={`block mb-1 text-xs`}>Jelszó</label>
        <Input type="password" {...form.register("password")} placeholder={`Jelszó`} className={`w-full`} />
      </div>
      <div>
        <label htmlFor={`confirmPassword`} className={`block mb-1 text-xs`}>Megerősítő jelszó</label>
        <Input type="password" {...form.register("confirmPassword")} placeholder={`Megerősítő jelszó`} className={`w-full`} />
      </div>
      <Button type="submit" className={`w-max`} disabled={!form.formState.isValid || form.formState.isSubmitting}>Küldés</Button>
    </form>

  )
}

export default PasswordChangeForm