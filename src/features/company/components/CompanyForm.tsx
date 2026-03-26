"use client"

import BankAccountNumberInput from '@/components/ui/bankAccountNumberInput'
import { Button } from '@/components/ui/btn'
import Combobox from '@/components/ui/combobox'
import { Input } from '@/components/ui/inpt'
import { Label } from '@/components/ui/label'
import TaxNumberInput from '@/components/ui/taxNumberInput'
import { companyFormSchema } from '@/features/company/lib/zodSchema'
import { CompanyInputs } from '@/features/company/utils/types'
import { countryCodes } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { RegisterForm } from '../../authentication/utils/types'


const CompanyForm: FC<{
  defaultValues?: RegisterForm['company'],
  onSubmit: SubmitHandler<CompanyInputs>,
  buttonTitle: string,
}> = ({ defaultValues, onSubmit, buttonTitle }) => {

  const form = useForm<CompanyInputs>({
    mode: "all",
    defaultValues,
    resolver: zodResolver(companyFormSchema)
  })

  const taxNumber = form.watch("taxnumber")

  useEffect(() => {
    if (taxNumber?.split("-")[1] !== "5" && form.getValues("groupMemberTaxNumber")) {
      form.setValue("groupMemberTaxNumber", "", { shouldValidate: true })
    }
  }, [taxNumber])


  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className='flex flex-col gap-4'>
        <div>
          <Label htmlFor={`company`} className={`block mb-1 text-xs`}>Cégnév*</Label>
          <Input type="text" id="name" {...form.register("name")} placeholder={`DokMester Kft`} />
        </div>
        <div>
          <Label htmlFor={`taxnumber`} className={`block mb-1 text-xs`}>Adószám*</Label>
          <Controller
            name="taxnumber"
            control={form.control}
            render={({ field }) => (
              <TaxNumberInput {...field} placeholder={`12345678-9-10`} />
            )}
          />
        </div>
        {taxNumber?.split("-")[1] === "5" && (
          <div>
            <Label htmlFor={`groupMemberTaxNumber`} className={`block mb-1 text-xs`}>Csoporttag adószáma (4-es áfakód)*</Label>
            <Controller
              name="groupMemberTaxNumber"
              control={form.control}
              render={({ field }) => (
                <TaxNumberInput {...field} placeholder={`12345678-4-10`} />
              )}
            />
          </div>
        )}
        <div className={`col-start-2 col-end-4`}>
          <Label htmlFor={`communityVatNumber`} className={`block mb-1 text-xs`}>Közösségi adószám</Label>
          <Input type="text" id="communityVatNumber" {...form.register("communityVatNumber")} placeholder={`HU12345678`} />
        </div>
        <div className={`col-start-1 col-end-3`}>
          <Label className={`block mb-1 text-xs`} htmlFor={`countryCode`}>Ország</Label>
          <Controller
            name="countryCode"
            control={form.control}
            render={({ field }) => (
              <Combobox value={field.value} options={countryCodes} onChange={field.onChange} placeholder="Ország kiválasztása..." />
            )}

          />
        </div>

        <div className={`grid grid-cols-3 gap-4 `}>
          <div>
            <Label htmlFor={`zip`} className={`block mb-1 text-xs`}>Irányítószám*</Label>
            <Input type="number" id="zip" {...form.register("zip")} placeholder={`1234`} />
          </div>
          <div className={`col-start-2 col-end-4`}>
            <Label htmlFor={`city`} className={`block mb-1 text-xs`}>Város*</Label>
            <Input type="text" id="city" {...form.register("city")} placeholder={`Budapest`} />
          </div>
        </div>
        <div>
          <Label htmlFor={`address`} className={`block mb-1 text-xs`}>Utca, házszám*</Label>
          <Input type="text" id="address" {...form.register("address")} placeholder={`Dokmester utca 100.`} />
        </div>
        <div>
          <Label className={`block mb-1 text-xs`} htmlFor={`bankAccountNumber`}>Bankszámlaszám (opcionális)</Label>
          <Controller
            control={form.control}
            name="bankAccountNumber"
            render={({ field: { onChange, value } }) => (
              <BankAccountNumberInput id="bankAccountNumber" onChange={onChange} value={value ?? ''} />
            )}
          />
        </div>
        <div>
          <Label className={`block mb-1 text-xs`} htmlFor={`color`}>Vállalkozásod fő színe</Label>
          <Input type={`color`} id={`color`}  {...form.register('color')} />
        </div>
        <Button type="submit" className={`block w-full min-w-full`} disabled={!form.formState.isValid || form.formState.isSubmitting}>{buttonTitle}</Button>
      </div>
    </form>
  )
}

export default CompanyForm