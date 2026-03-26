export const invoiceStatus = {
  aborted: "NAV adatszolgáltatás sikertelen",
  validation: "NAV adatszolgáltatás folyamatban",
  pending: "Függőben",
  sended: "Elküldve",
  expired: "Lejárt",
} as const

export const InvoiceStatusEnum = ["aborted", "validation", "pending", "sended", "expired"] as const

export const invoiceType = {
  CREATE: "Számla",
  MODIFY: "Helyesbítő számla",
  STORNO: "Sztornó számla",
} as const

export const invoiceTypeEnum = ["CREATE", "MODIFY", "STORNO"] as const

export const navStatus = {
  INACTIVE: "Adatszolgáltatás nem aktív",
  SUCCESS: "Adatszolgáltatás sikeres",
  ABORTED: "Adatszolgáltatás sikertelen",
} as const

export const navStatusEnum = ["INACTIVE", "SUCCESS", "ABORTED", "PENDING"] as const
