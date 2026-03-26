"use client"

import { Button } from '@/components/ui/btn';
import Combobox from '@/components/ui/combobox';
import { Input } from '@/components/ui/inpt';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phoneNumberInput';
import TaxNumberInput from '@/components/ui/taxNumberInput';
import { countryCodes } from '@/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { PartnerInputs } from '../utils/types';
import { PartnerFormSchema } from '../zod';

const PartnerForm: FC<{
  defaultValues?: PartnerInputs,
  onSubmit: SubmitHandler<PartnerInputs>,
  buttonTitle: string,
}> = ({ defaultValues, onSubmit, buttonTitle }) => {

  const form = useForm<PartnerInputs>({
    mode: "all",
    defaultValues,
    resolver: zodResolver(PartnerFormSchema, {}),
  });

  const taxNumber = form.watch("taxnumber")

  useEffect(() => {
    if (taxNumber?.split("-")[1] !== "5" && form.getValues("groupMemberTaxNumber")) {
      form.setValue("groupMemberTaxNumber", "", { shouldValidate: true })
    }
  }, [taxNumber])

  return (
    <form className={`grid grid-cols-1 gap-4 h-max`} onSubmit={form.handleSubmit(onSubmit)}>
      <div className='flex flex-col gap-2'>
        <div>
          <label className={`block mb-1 text-xs`} htmlFor={`name`}>Teljes név</label>
          <Input type={`text`} placeholder={`Név`} className={`w-full`} {...form.register("name")} />
        </div>
        <div>
          <label className={`block mb-1 text-xs`} htmlFor={`taxnumber`}>Adószám (Cég esetén)</label>
          <Controller
            name="taxnumber"
            control={form?.control}
            render={({ field }) => (
              <TaxNumberInput {...field} placeholder="49736485-5-24" />
            )}
          />
        </div>
        <div>
          <label htmlFor={`groupMemberTaxNumber`} className={`block mb-1 text-xs`}>Csoporttag adószáma (4-es áfakód)*</label>
          <Controller
            name="groupMemberTaxNumber"
            control={form.control}
            render={({ field }) => (
              <TaxNumberInput {...field} placeholder={`12345678-4-10`} disabled={taxNumber?.split("-")[1] !== "5"} />
            )}
          />
        </div>
        <div className={`col-start-2 col-end-4`}>
          <label htmlFor={`communityVatNumber`} className={`block mb-1 text-xs`}>Közösségi adószám</label>
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

        <div className={`grid grid-cols-6 gap-4`}>
          <div className={`col-start-1 col-end-3`}>
            <label className={`block mb-1 text-xs`} htmlFor={`zip`}>Irányítószám</label>
            <Input type={`number`} placeholder={`1234`} className={`w-full`} {...form.register("zip")} />
          </div>
          <div className={`col-start-3 col-end-7`}>
            <label className={`block mb-1 text-xs`} htmlFor={`city`}>Város</label>
            <Input type={`text`} placeholder={`Budapest`} className={`w-full`} {...form.register("city")} />
          </div>
        </div>
        <div>
          <label className={`block mb-1 text-xs`} htmlFor={`address`}>Utca, házszám</label>
          <Input type={`text`} placeholder={`Dokmester utca 100.`} className={`w-full`} {...form.register("address")} />
        </div>
        <div className={`grid grid-cols-2 gap-4`}>
          <div>
            <label className={`block mb-1 text-xs`} htmlFor={`email`}>E-mail cím</label>
            <Input type={`email`} placeholder={`e-mail cím`} className={`w-full`} {...form.register("email")} />
          </div>
          <div>
            <label className={`block mb-1 text-xs`} htmlFor={`mobile`}>Telefonszám (opcionális)</label>
            <Controller
              control={form.control}
              name="mobile"
              render={({ field: { onChange, value } }) => (
                <PhoneInput defaultCountry='HU' onChange={onChange} placeholder="30 456 2546" value={value ?? ''} />
              )}
            />
          </div>
        </div>

        <Button type={`submit`} loading={form.formState.isSubmitting} disabled={!form.formState.isValid || form.formState.isSubmitting}>{buttonTitle}</Button>
      </div>

    </form>
  )
}

export default PartnerForm