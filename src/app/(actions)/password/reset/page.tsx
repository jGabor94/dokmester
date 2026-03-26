"use client"

import { Button } from '@/components/ui/btn';
import { Input } from '@/components/ui/inpt';
import { SA_SendPasswrordReset } from '@/features/authentication/actions';
import { passwordResetSchema } from '@/features/authentication/lib/zodSchema';
import { PasswordResetForm } from '@/features/authentication/utils/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheckBig } from 'lucide-react';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const page: FC<{}> = () => {

  const form = useForm<PasswordResetForm>({
    resolver: zodResolver(passwordResetSchema, {}),
  })

  const onSubmit: SubmitHandler<PasswordResetForm> = async (data) => {

    const res = await SA_SendPasswrordReset(data.email);

    if (res.statusCode !== 200 && res.statusCode !== 500) {
      toast.error(res.error);
      throw new Error(res.statusMessage);
    }

    if (res.statusCode === 500) {
      toast.error(res.statusMessage);
      throw new Error(res.statusMessage);
    }

  }

  if (form.formState.isSubmitSuccessful) return (
    <div className='flex flex-col items-center gap-4'>
      <p className='text-3xl'>Helyreállító link sikeresen elküldve!</p>
      <CircleCheckBig width={120} height={120} color="#00c853" />
    </div>
  )

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={`grid gap-4 border shadow-sm p-3 bg-card rounded-2xl max-w-md w-full mx-auto`}>
      <h1 className={`font-bold text-2xl`}>Jelszó helyreállítás</h1>
      <p className='text-sm'>Add meg az E-mail címed amire elküldjük a jelszó helyreállításhoz szükséges linket.</p>
      <div>
        <label htmlFor={`email`} className={`block mb-1 text-xs`}>E-mail cím</label>
        <Input type="text" {...form.register("email")} placeholder={`E-mail cím`} className={`w-full`} />
      </div>
      <Button type="submit" className={`w-max`} disabled={!form.formState.isValid || form.formState.isSubmitting}>Küldés</Button>
    </form>
  )
}

export default page