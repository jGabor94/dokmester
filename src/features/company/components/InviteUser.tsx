"use client"

import { Button } from '@/components/ui/btn';
import { DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/inpt';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SA_InviteUser } from '../actions';
import { inviteFormSchema } from '../lib/zodSchema';
import { InviteInputs, SelectCompany } from '../utils/types';

const InviteUser: FC<{ company: SelectCompany }> = ({ company }) => {

  const form = useForm<InviteInputs>({
    resolver: zodResolver(inviteFormSchema),
    mode: "all"
  });

  const onSubmit: SubmitHandler<InviteInputs> = async (data) => {

    const res = await SA_InviteUser(data.email, company.name)

    if (res.statusCode === 200) {
      toast.success('Meghívás sikeres!');
      form.reset();
    } else if (res.statusCode !== 500) {
      toast.error(res.error);
    } else {
      toast.error(res.statusMessage);
    }
  }


  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4">
        <div>
          <label htmlFor="email" className={`block text-xs mb-1`}>Új felhasználó e-mail címe</label>
          <Input type={`text`} placeholder={`E-mail cím`} {...form.register(`email`)} />
        </div>
        <div>
          <DialogTrigger asChild>
            <Button type={`submit`} loading={form.formState.isSubmitting} disabled={!form.formState.isValid || form.formState.isSubmitting} >Meghívás</Button>
          </DialogTrigger>
        </div>
      </div>
    </form>

  )
}

export default InviteUser