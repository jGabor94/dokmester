import { z } from "zod";
import { currencyCodes, paymentMethods } from "../constants";

export const taxnumberSchema = z.coerce.string({ required_error: 'Adószám megadása kötelező!' })
  .refine((val) => !/^\d{8}-4-\d{2}$/.test(val), { message: 'A csoporttag áfakóddal rendelkező adószámot a csoporttag adószám mezőben kell megadni!' })
  .refine((val) => val === '' || /^\d{8}-[1235]-\d{2}$/.test(val), { message: 'Helytelen adószám formátum' })
export const groupMemberTaxNumberSchema = z.coerce.string().refine((val) => val === '' || /^\d{8}-4-\d{2}$/.test(val), { message: 'Helytelen csoporttag adószám formátum' })
export const communityVatNumberSchema = z.coerce.string().refine((val) => val === '' || /^[A-Z]{2}[0-9]{8}$/.test(val), { message: 'Helytelen közösségi adószám formátum' })
export const zipSchema = z.coerce.string().refine((val) => /^\d{4}$/.test(val), {
  message: "Helytelen irányítószám!",
}).transform(Number);

export const mobilSchema = z.string({ required_error: "Telefonszám megadása kötelező!" }).refine((value) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g.test(value), { message: "Helytelen telefonszám!" })
export const countryCodeSchema = z.string({ required_error: "Ország megadása kötelező" }).length(2, { message: "Országkód hossza pontosan 2 karakter hosszú lehet ISO 3166 alpha2 szabvány szerint!" })
export const bankAccountNumberSchema = z.string({ required_error: "Bankszámlaszám megadása kötelező!" }).refine((val) => {
  console.log(val)
  return val === '' || /^(?:\d{8}-\d{8}|\d{8}-\d{8}-\d{8})$/.test(val)
}, { message: 'A bankszámlaszámnak 16 vagy 24 számjegyből kell állnia.' })

export const nameSchema = z.string().min(3, { message: "Név megadása kötelező! (min. 3 karakter)" })
export const citySchema = z.string().min(3, { message: "Város megadása kötelező! (min. 3 karakter)" })
export const addressSchema = z.string().min(3, { message: "Utca/házszám megadása kötelező! (min. 3 karakter)" })
export const emailSchema = z.string().email({ message: "Helytelen email cím!" })
export const exchangeRateSchema = z.coerce.number({ required_error: "Árfolyam megadása kötelező!" })
export const currencySchema = z.enum([currencyCodes[0].value, ...currencyCodes.slice(1).map((p) => p.value)])
export const paymentMethodSchema = z.enum([paymentMethods[0].value, ...paymentMethods.slice(1).map((p) => p.value)])