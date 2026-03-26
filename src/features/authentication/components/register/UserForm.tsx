"use client"

import { Button } from '@/components/ui/btn'
import { Input } from '@/components/ui/inpt'
import { PhoneInput } from '@/components/ui/phoneNumberInput'
import { registerUserFormSchema } from '@/features/user/lib/zodSchema'
import { RegisterUserInputs } from '@/features/user/utils/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, FC, SetStateAction } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { RegisterForm } from '../../utils/types'


const UserForm: FC<{
  setPage: Dispatch<SetStateAction<number>>,
  setSubmitValues: Dispatch<SetStateAction<RegisterForm>>,
  submitValues: RegisterForm
}> = ({ setPage, submitValues, setSubmitValues }) => {

  const form = useForm({
    mode: "all",
    defaultValues: submitValues.user,
    resolver: zodResolver(registerUserFormSchema)
  })

  const handleNext: SubmitHandler<RegisterUserInputs> = (data) => {
    setSubmitValues(state => ({ ...state, user: data }))
    setPage(submitValues.verified ? 4 : 3)
  }

  const handleBack = () => {
    const data = form.getValues()
    setSubmitValues(state => ({ ...state, user: data }))
    setPage(state => state - 1)
  }

  return (
    <form onSubmit={form.handleSubmit(handleNext)}>
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
          <Input type="email" id="email" {...form.register("email")} placeholder={`regisztralok@dokmester.com`} />
        </div>
        <div>
          <label htmlFor={`password`} className={`block mb-1 text-xs`}>Jelszó</label>
          <Input type="password" id="password" {...form.register("password")} placeholder={`Jelszó`} />
        </div>
        <div>
          <label htmlFor={`password`} className={`block mb-1 text-xs`}>Jelszó megerősítése</label>
          <Input type="password" id="password" {...form.register("confirmPassword")} placeholder={`Jelszó`} />
        </div>
        <div className={`grid grid-cols-2 gap-4 justify-center items-center`}>
          <Button type="button" variant={'outline'} onClick={handleBack}>Vissza</Button>
          <Button type="submit" disabled={!form.formState.isValid}>Tovább</Button>
        </div>
      </div>
    </form>

  )
}

export default UserForm