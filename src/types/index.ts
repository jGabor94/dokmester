import { countryCodes, currencyCodes, paymentMethods } from "@/lib/constants";

export type AnyObject = Record<string, any>

export type ExpandObject<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N;

export type CurrencyCode = typeof currencyCodes[number]["value"]
export type CountryCode = typeof countryCodes[number]["value"]
export type PaymentMethod = typeof paymentMethods[number]["value"];
