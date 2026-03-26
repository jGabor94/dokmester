import * as z from 'zod';
import { itemTypes, vatRatesValues } from './contants';

export const itemSchema = z.object({
  name: z.string().min(3, { message: "Tétel nevének megadása kötelező! (min. 3 karakter)" }),
  unitPrice: z.coerce.number({ required_error: "Nettó ár megadása kötelező!" }),
  unit: z.string().min(1, { message: "Mennyiségi egység megadása kötelező!" }),
  vatkey: z.enum([vatRatesValues[0], ...vatRatesValues.slice(1)]),
  type: z.enum(itemTypes),
})

export const itemsSchema = z.array(itemSchema)

export const itemsFormSchema = z.object({ items: itemsSchema });