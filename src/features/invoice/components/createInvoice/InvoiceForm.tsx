'use client'
import { Button } from "@/components/ui/btn";
import Combobox from "@/components/ui/combobox";
import { Input } from "@/components/ui/inpt";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phoneNumberInput";
import PriceInput from "@/components/ui/priceInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TaxNumberInput from "@/components/ui/taxNumberInput";
import { Textarea } from "@/components/ui/textarea";
import { FullCompany } from "@/features/company/utils/types";
import { itemTypes, itemTypesMap, vatRates } from "@/features/items/lib/contants";
import { SelectPartner } from "@/features/partners/utils/types";
import { countryCodes, currencyCodes, paymentMethods } from "@/lib/constants";
import { PlusIcon, XIcon } from "lucide-react";
import { FC, useEffect } from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { InvoiceInputs } from "../../lib/types";


const InvoiceForm: FC<{ company: FullCompany, form: UseFormReturn<InvoiceInputs>, partners: SelectPartner[] }> = ({ company, form, partners }) => {

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleItemChange = (index: number, e: string) => {
    const item = company.items.find((item) => item.id === e)

    if (item) {
      update(index, {
        name: item.name,
        unitPrice: item.unitPrice,
        unit: item.unit,
        vatkey: item.vatkey,
        quantity: 1,
        type: item.type
      })
    }
  }

  const handlePartnerChange = (e: string) => {
    const partner = partners.find((partner) => partner.id === e)
    console.log({ partner })
    if (partner) {
      form.setValue('customer', {
        name: partner.name,
        taxnumber: partner.taxnumber,
        groupMemberTaxNumber: partner.groupMemberTaxNumber,
        communityVatNumber: partner.communityVatNumber,
        countryCode: partner.countryCode,
        zip: partner.zip,
        city: partner.city,
        address: partner.address,
        email: partner.email,
        mobile: partner.mobile,
      })
    }
  }

  const taxNumber = form.watch("customer.taxnumber")
  const currency = form.watch("currency")
  const countryCode = form.watch("customer.countryCode")


  useEffect(() => {
    if (taxNumber?.split("-")[1] !== "5" && form.getValues("customer.groupMemberTaxNumber")) {
      form.setValue("customer.groupMemberTaxNumber", "", { shouldValidate: true })
    }
    if (currency === "HUF") {
      form.setValue("exchangeRate", 1, { shouldValidate: true })
    }
  }, [taxNumber, currency, countryCode])



  return (
    <div className="flex flex-col gap-4 w-full">
      <div className={`flex flex-row flex-wrap w-full gap-4`}>

        {/*-----------------------------------------------------------------------------------------------*/}
        {/*-------------------------------------------- Vevő  --------------------------------------------*/}
        {/*-----------------------------------------------------------------------------------------------*/}

        <div className={`border shadow-sm p-3 rounded-2xl bg-card w-full flex-1 gap-4 h-max min-w-[500px] flex flex-col `}>
          <div>
            <Label className={`block mb-1 text-xs`} htmlFor={`partner-select`}>Meglévő partner kiválasztása</Label>
            <Select onValueChange={(e) => handlePartnerChange(e)}>
              <SelectTrigger className="w-full" id={`partner-select`}>
                <SelectValue placeholder="Meglévő partner kiválasztása" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Meglévő partner kiválasztása</SelectItem>
                {partners.map(item => (
                  <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className={`block mb-1 text-xs`} htmlFor={`customer.name`}>Teljes név</Label>
            <Input type={`text`} placeholder={`Név`}  {...form.register("customer.name")} />
          </div>
          <div>
            <Label className={`block mb-1 text-xs`} htmlFor={`customer.taxnumber`}>Adószám (Cég esetén)</Label>
            <Controller
              name="customer.taxnumber"
              control={form.control}
              render={({ field }) => (
                <TaxNumberInput {...field} id="customer.taxnumber" placeholder="49736485-3-24" />
              )}
            />
          </div>
          {taxNumber?.split("-")[1] === "5" && (
            <div>
              <Label htmlFor={`customer.groupMemberTaxNumber`} className={`block mb-1 text-xs`}>Csoporttag adószáma (4-es áfakód)*</Label>
              <Controller
                name="customer.groupMemberTaxNumber"
                control={form.control}
                render={({ field }) => (
                  <TaxNumberInput {...field} id="customer.groupMemberTaxNumber" placeholder={`12345678-4-10`} />
                )}
              />
            </div>
          )}
          <div className={`col-start-2 col-end-4`}>
            <Label htmlFor={`customer.communityVatNumber`} className={`block mb-1 text-xs`}>Közösségi adószám (opcionális)</Label>
            <Input type="text" id="customer.communityVatNumber" {...form.register("customer.communityVatNumber")} placeholder={`HU12345678`} />
          </div>
          <div className={`grid grid-cols-6 gap-4`}>
            <div className={`col-start-1 col-end-3`}>
              <Label className={`block mb-1 text-xs`} htmlFor={`customer.countryCode`}>Ország</Label>
              <Controller
                name="customer.countryCode"
                control={form.control}
                render={({ field }) => (
                  <Combobox
                    value={field.value}
                    id="customer.countryCode"
                    options={countryCodes}
                    onChange={field.onChange}
                    placeholder="Ország kiválasztása..."
                    buttonClassname="w-[300px]"
                  />
                )}
              />
            </div>
            <div className={`col-start-1 col-end-3`}>
              <Label className={`block mb-1 text-xs`} htmlFor={`customer.zip`}>Irányítószám*</Label>
              <Input type={`number`} placeholder={`1234`} id="customer.zip"  {...form.register("customer.zip")} />
            </div>
            <div className={`col-start-3 col-end-7`}>
              <Label className={`block mb-1 text-xs`} htmlFor={`customer.city`}>Város*</Label>
              <Input type={`text`} placeholder={`Budapest`} id="customer.city"  {...form.register("customer.city")} />
            </div>
          </div>
          <div>
            <Label className={`block mb-1 text-xs`} htmlFor={`customer.address`}>Utca, házszám*</Label>
            <Input type={`text`} placeholder={`Dokmester utca 100.`} id="customer.address" {...form.register("customer.address")} />
          </div>
          <div className={`grid grid-cols-2 gap-4`}>
            <div>
              <Label className={`block mb-1 text-xs`} htmlFor={`customer.email`}>E-mail cím*</Label>
              <Input type={`email`} placeholder={`e-mail cím`} id="customer.email" {...form.register("customer.email")} />
            </div>
            <div>
              <Label className={`block mb-1 text-xs`} htmlFor={`customer.mobile`}>Telefonszám (opcionális)</Label>
              <Controller
                control={form.control}
                name="customer.mobile"
                render={({ field: { onChange, value } }) => (
                  <PhoneInput defaultCountry='HU' id="customer.mobile" onChange={onChange} placeholder="30 456 2546" value={value ?? ''} />
                )}
              />
            </div>

          </div>
        </div>

        {/*--------------------------------------------------------------------------------------------------------*/}
        {/*-------------------------------------------- Számla adatok  --------------------------------------------*/}
        {/*--------------------------------------------------------------------------------------------------------*/}

        <div className={`border shadow-sm p-3 rounded-2xl flex-1 gap-4 bg-card  h-max lg:col-start-2 lg:col-end-4  min-w-[500px] flex flex-col`}>
          <div>
            <Label htmlFor="paymentMethod" className={`block mb-1 text-xs`}>Fizetési mód *</Label>
            <Controller
              name={`paymentMethod`}
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={onChange} value={value || undefined}>
                  <SelectTrigger id="paymentMethod"  >
                    <SelectValue placeholder="Fizetési mód" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(paymentMethod => (
                      <SelectItem key={paymentMethod.value} value={paymentMethod.value}>{paymentMethod.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-row gap-2">

            <div>
              <Label htmlFor="currency" className={`block mb-1 text-xs`}>Pénznem *</Label>
              <Controller
                name="currency"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <Combobox
                    value={value}
                    id="currency"
                    options={currencyCodes}
                    onChange={onChange}
                    placeholder="Pénznem kiválasztása..."
                    renderItem={(option) => < ><b>{option.value}</b> <span className="text-nowrap">{option.label}</span></>}
                    buttonClassname="w-[300px]"
                  />
                )}
              />
            </div>

            {currency !== "HUF" && (
              <div>
                <Label htmlFor="exchangeRate" className={`block mb-1 text-xs`}>Árfolyam *</Label>
                <Input type={`number`} id="exchangeRate" {...form.register(`exchangeRate`)} />
              </div>
            )}

          </div>

          <div>
            <Label htmlFor="completionDate" className={`block mb-1 text-xs`}>Teljesítés dátuma *</Label>
            <Input type={`date`} id="completionDate" {...form.register(`completionDate`)} />
          </div>
          <div>
            <Label htmlFor="dueDate" className={`block mb-1 text-xs`}>Fizetési határidő *</Label>
            <Input type={`date`} id="dueDate" {...form.register(`dueDate`)} />
          </div>
          <div className={`col-start-3 col-end-7`}>
            <Label className={`block mb-1 text-xs`} htmlFor={`comment`}>Megjegyzés a számlához (opcionális)</Label>
            <Textarea id="comment" {...form.register("comment")} />
          </div>
        </div>
      </div>

      {/*-------------------------------------------------------------------------------------------------*/}
      {/*-------------------------------------------- Tételek --------------------------------------------*/}
      {/*-------------------------------------------------------------------------------------------------*/}

      <div className={`border shadow-sm p-3 rounded-2xl flex-1 gap-4 bg-card  h-max lg:col-start-2 lg:col-end-4  min-w-[500px] flex flex-col`}>
        {fields.map((field, index) => (
          <div key={field.id} className={`${index > 0 ? 'border-t pt-4 border-primary' : ''}`}>
            <div key={field.id} className={`grid grid-cols-1 gap-4`}>
              <div className={`grid grid-cols-2 gap-4`}>
                <div className={``}>
                  <Label className={`block mb-1 text-xs`} htmlFor={`items.${index}.name`}>Meglévő tétel kiválasztása</Label>
                  <Select onValueChange={(e) => handleItemChange(index, e)}>
                    <SelectTrigger id={`items.${index}.name`}>
                      <SelectValue placeholder="Meglévő tétel kiválasztása" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Meglévő tétel kiválasztása</SelectItem>
                      {company.items.map(item => (
                        <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className={`block mb-1 text-xs`} htmlFor={`items.${index}.name`}>Tétel neve</Label>
                  <Input type={`text`} id={`items.${index}.name`} {...form.register(`items.${index}.name`)} />
                </div>
              </div>
              <div className={`flex flex-row gap-4 flex-wrap`}>
                <div className={`col-start-1 col-end-3`}>
                  <Label className={`block mb-1 text-xs`} htmlFor={`item-quantity-${index}`}>Mennyiség</Label>
                  <Input type={`number`} id={`item-quantity-${index}`} {...form.register(`items.${index}.quantity`)} />
                </div>
                <div className={`col-start-3 col-end-7 md:col-end-6`}>
                  <Label className={`block mb-1 text-xs`} htmlFor={`items.${index}.unitPrice`}>Nettó egységár</Label>
                  <Controller
                    name={`items.${index}.unitPrice`}
                    control={form.control}
                    render={({ field }) => (
                      <PriceInput {...field} id={`items.${index}.unitPrice`} currency={currency} />
                    )}
                  />
                </div>
                <div className={`col-start-1 col-end-3 md:col-start-6 md:col-end-8`}>
                  <Label className={`block mb-1 text-xs`} htmlFor={`items.${index}.unit`}>Mennyiségi egység</Label>
                  <Input type={`text`} id={`items.${index}.unit`}  {...form.register(`items.${index}.unit`)} />
                </div>
                <div className={`col-start-5 col-end-7`}>
                  <Label className={`block mb-1 text-xs`} htmlFor={`items.${index}.vatkey`}>Áfakulcs*</Label>
                  <Controller
                    name={`items.${index}.vatkey`}
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <Select onValueChange={onChange} value={value}>
                        <SelectTrigger id={`items.${index}.vatkey`} >
                          <SelectValue placeholder="Áfakulcs" />
                        </SelectTrigger>
                        <SelectContent>
                          {vatRates.map((vatRate, index) => (
                            <SelectItem key={index} value={vatRate.value}>{`${vatRate.value}${vatRate.reason ? ":" : ""} ${vatRate.reason}`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className={`col-start-5 col-end-7`}>
                  <Label className={`block mb-1 text-xs`} htmlFor={`items.${index}.type`}>Típus*</Label>
                  <Controller
                    name={`items.${index}.type`}
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <Select onValueChange={onChange} value={value}>
                        <SelectTrigger id={`items.${index}.type`} >
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
                <div className={`text-end col-start-6 col-end-7 md:col-start-10 md:col-end-11`}>
                  <Button variant={`destructive`} size={`icon`} onClick={() => remove(index)}>
                    <XIcon />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div>
          <Button type={`button`} onClick={() => append({ name: "", unitPrice: 0, quantity: 1, unit: "", vatkey: "27%", type: "PRODUCT" })}>
            <PlusIcon />
            <span>Tétel hozzáadása</span>
          </Button>
        </div>
      </div>
    </div>

  )
}

export default InvoiceForm