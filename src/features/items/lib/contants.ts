import { VatRate } from "../utils/types"

export const vatExemption = [
  {
    reason: "Alanyi adómentes",
    value: "AAM",
    vatValue: 0
  },
  {
    reason: "Tárgyi adómentes",
    value: "TAM",
    vatValue: 0
  },
  {
    reason: "EU-n belüli termékértékesítés",
    value: "KBAET",
    vatValue: 0
  },
  {
    reason: "közösségen belüli új közlekedési eszköz értékesítés",
    value: "KBAUK",
    vatValue: 0
  },
  {
    reason: "EU-n kívüli termékértékesítés",
    value: "EAM",
    vatValue: 0
  },
  {
    reason: "Adómentesség",
    value: "NAM",
    vatValue: 0
  },
] as const

export const vatOutOfScope = [
  {
    reason: "Áfa tárgyi hatályán kívül",
    value: "ATK",
    vatValue: 0
  },
  {
    reason: "Másik tagállamban teljesített, fordítottan adózó ügylet",
    value: "EUFAD37",
    vatValue: 0
  },
  {
    reason: "Másik tagállamban teljesített, fordítottan adózó ügylet",
    value: "EUFADE",
    vatValue: 0
  },
  {
    reason: "Másik tagállamban teljesített, NEM fordítottan adózó ügylet",
    value: "EUE",
    vatValue: 0
  },
  {
    reason: "Harmadik országban teljesített ügylet",
    value: "HO",
    vatValue: 0
  },
] as const

export const vatPercentage = [
  {
    reason: "",
    value: "27%",
    vatValue: 0.27
  },
  {
    reason: "",
    value: "18%",
    vatValue: 0.18
  },
  {
    reason: "",
    value: "5%",
    vatValue: 0.05
  },
  {
    reason: "",
    value: "0%",
    vatValue: 0
  },
] as const

export const KAFA = [
  {
    reason: "",
    value: "K.AFA TRAVEL_AGENCY",
    vatValue: 0,
  },
  {
    reason: "",
    value: "K.AFA SECOND_HAND",
    vatValue: 0,
  },
  {
    reason: "",
    value: "K.AFA ARTWORK",
    vatValue: 0,
  },
  {
    reason: "",
    value: "K.AFA ANTIQUES",
    vatValue: 0,
  },
] as const



export const vatRates = [
  ...vatPercentage,
  ...vatExemption,
  {
    reason: "Fordított adózás",
    value: "F.AFA",
    vatValue: 0,
  },
  ...vatOutOfScope,
  ...KAFA
] as const

export const vatRatesMap = vatRates.reduce((acc, curr) => {
  return { ...acc, [curr.value]: { ...curr } }
}, {} as Record<VatRate["value"], { reason: string, vatValue: number, value: string }>)


export const itemTypesMap = {
  PRODUCT: "Termék",
  SERVICE: "Szolgáltatás",
  OTHER: "Egyéb",
} as const

export const vatExemptionValues = vatExemption.map((vatRate) => vatRate.value)
export const vatOutOfScopeValues = vatOutOfScope.map((vatRate) => vatRate.value)
export const vatPercentageValues = vatPercentage.map((vatRate) => vatRate.value)
export const KAFAValues = KAFA.map((vatRate) => vatRate.value)
export const vatRatesValues = vatRates.map((vatRate) => vatRate.value)
export const itemTypes = ["PRODUCT", "SERVICE", "OTHER"] as const;


