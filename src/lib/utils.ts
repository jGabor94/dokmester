import { CurrencyCode } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const HUF = new Intl.NumberFormat('hu-HU', {
  style: 'currency',
  currency: 'HUF',
});

export const formatPrice = (price: number, currency: CurrencyCode = "HUF") => new Intl.NumberFormat('hu-HU', {
  currency, style: "currency",
  currencyDisplay: "symbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: currency === "HUF" ? 0 : 2,
}).format(price)

export const formatCardExpDate = (expMonth: number, expYear: number) => `${expMonth < 10 ? `0${expMonth}` : expMonth}/${expYear % 100}`

export const random10DigitNumber = () => Math.floor(1e9 + Math.random() * 9e9);

export const getUnixTimestamp = (date: Date) => {
  if (date) {
    if (date instanceof Date) {
      return Math.ceil(date.getTime())
    } else {
      return Math.ceil(Date.parse(date))
    }
  } else {
    const currentDate = new Date()
    return Math.ceil(Date.parse(currentDate.toISOString()))
  }

}

export const getDate = (ISO8601Time: number | string | Date, time: boolean = false) => {
  const dateObj = new Date(ISO8601Time);
  const currentDate = new Date()

  if (dateObj.toISOString().slice(0, 10) === currentDate.toISOString().slice(0, 10)) {
    return dateObj.toLocaleTimeString('hu-HU', {
      hour: 'numeric',
      minute: 'numeric'
    })
  }

  else if (Math.abs(getUnixTimestamp(currentDate) - getUnixTimestamp(dateObj)) < (1000 * 60 * 60 * 24 * 6)) {
    return dateObj.toLocaleDateString('hu-HU', {
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric'
    })
  } else if (currentDate.getFullYear() === dateObj.getFullYear()) {
    return dateObj.toLocaleDateString('hu-HU', {
      month: 'short',
      day: 'numeric',
      ...(time && { hour: 'numeric', minute: 'numeric' })
    })
  } else {
    return dateObj.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
}

export const normalizeDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  const day = date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate();
  return `${year}.${month}.${day}.`;
}


export const generateMonogram = (input: string) => {
  const words = input.trim().split(/\s+/)

  if (words.length === 0) return ""

  if (words.length >= 3) {
    return (words[0][0] + words[1][0] + words[2][0]).toUpperCase()
  } else if (words.length === 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  } else {
    return words[0].slice(0, 2).toUpperCase()
  }
}





