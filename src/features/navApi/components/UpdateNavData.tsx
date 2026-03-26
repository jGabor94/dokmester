"use client"

import { Button } from '@/components/ui/btn';
import { Input } from '@/components/ui/inpt';
import { SA_UpdateNavData } from '@/features/navApi/actions';
import { NavDataInputs, SelectNavData } from '@/features/navApi/lib/types';
import { navDataFormSchema } from '@/features/navApi/lib/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const UpdateNavData: FC<{ initNavData?: SelectNavData | null }> = ({ initNavData }) => {

  const form = useForm<NavDataInputs>({
    mode: "all",
    defaultValues: initNavData ? {
      username: initNavData.userName,
      password: initNavData.password,
      signatureKey: initNavData.signatureKey,
      exchangeKey: initNavData.exchangeKey
    } : {},
    resolver: zodResolver(navDataFormSchema),
  });

  const onSubmit: SubmitHandler<NavDataInputs> = async (data) => {

    const res = await SA_UpdateNavData(data)

    if (res.statusCode === 200) {
      toast.success('Nav kapcsolati adatok sikeresen frissítve');
    } else if (res.statusCode === 400) {
      toast.error("Hibás adatok!");
    } else {
      toast.error(res.statusMessage);
    }

  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col border border-1 rounded-lg bg-card shadow-sm">
        <span className='py-2 px-4 font-semibold'>NAV kapcsolati adatok</span>
        <div className='h-[1px] bg-gray-200' />
        <div className='flex flex-col gap-4 p-4'>
          <div className={`col-start-3 col-end-7`}>
            <label className={`block mb-1 text-xs`} htmlFor={`username`}>Technikai felhasználó neve</label>
            <Input type={`text`} placeholder={`Felhasználónév`} id={`username`}  {...form.register('username')} />
          </div>
          <div className={`col-start-3 col-end-7`}>
            <label className={`block mb-1 text-xs`} htmlFor={`password`}>Jelszó</label>
            <Input type={`password`} placeholder={`Jelszó`} id={`password`} {...form.register('password')} />
          </div>
          <div>
            <label className={`block mb-1 text-xs`} htmlFor={`signatureKey`}>Aláírókulcs</label>
            <Input type={`password`} placeholder={`Aláírókulcs`} id={`signatureKey`} {...form.register('signatureKey')} />
          </div>
          <div>
            <label className={`block mb-1 text-xs`} htmlFor={`exchangeKey`}>Cserekulcs</label>
            <Input type={`password`} placeholder={`Cserekulcs`} id={`exchangeKey`} {...form.register('exchangeKey')} />
          </div>
          <Button type="submit" loading={form.formState.isSubmitting} disabled={!form.formState.isValid || form.formState.isSubmitting}>Küldés</Button>
        </div>
      </div>
    </form>

  )
}

export default UpdateNavData