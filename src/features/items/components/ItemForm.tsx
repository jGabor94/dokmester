import { Input } from '@/components/ui/inpt'
import PriceInput from '@/components/ui/priceInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FC } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { itemTypes, itemTypesMap, vatRates } from '../lib/contants'

const ItemForm: FC<{ form: UseFormReturn<any, any, undefined>, prefix: string }> = ({ form, prefix }) => {

  const prefixRaw = prefix.substring(0, prefix.length - 1)

  return (
    <>
      <div className={`col-start-1 col-end-7`}>
        <label className={`block mb-1 text-xs`} htmlFor={`name`}>Termék neve*</label>
        <Input type={`text`} placeholder={`Név`} className={`w-full`} {...form.register(`${prefixRaw}.name`)} />
      </div>
      <div className={`col-start-1 col-end-3`}>
        <label className={`block mb-1 text-xs`} htmlFor={`price`}>Nettó egységár*</label>
        <Controller
          name={`${prefixRaw}.unitPrice`}
          control={form.control}
          render={({ field }) => (
            <PriceInput {...field} />
          )}
        />
      </div>
      <div className={`col-start-3 col-end-5`}>
        <label className={`block mb-1 text-xs`} htmlFor={`unit`}>Mértékegység*</label>
        <Input type={`text`} placeholder={`db`} className={`w-full`} {...form.register(`${prefixRaw}.unit`)} />
      </div>
      <div className={`col-start-5 col-end-7`}>
        <label className={`block mb-1 text-xs`} htmlFor={`vatkey`}>Áfakulcs*</label>
        <Controller
          name={`${prefixRaw}.vatkey`}
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <Select onValueChange={onChange} value={value}>
              <SelectTrigger className="w-full" >
                <SelectValue placeholder="Áfakulcs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Áfakulcs</SelectItem>
                {vatRates.map((vatRate, index) => (
                  <SelectItem key={index} value={vatRate.value}>{`${vatRate.value}${vatRate.reason ? ":" : ""} ${vatRate.reason}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className={`col-start-5 col-end-7`}>
        <label className={`block mb-1 text-xs`} htmlFor={`vatkey`}>Típus*</label>
        <Controller
          name={`${prefixRaw}.type`}
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <Select onValueChange={onChange} value={value}>
              <SelectTrigger className="w-full" >
                <SelectValue placeholder="Típus" />
              </SelectTrigger>
              <SelectContent>
                {itemTypes.map((type, index) => (
                  <SelectItem key={index} value={type}>{`${itemTypesMap[type]}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </>

  )
}

export default ItemForm