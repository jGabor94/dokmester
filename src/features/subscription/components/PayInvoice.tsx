"use client"

import { Button } from '@/components/ui/btn'
import { FC } from 'react'
import toast from 'react-hot-toast'
import SA_PayInvoice from '../actions/payInvoice'

const PayInvoice: FC<{ inID: string, className: string }> = ({ inID, className }) => {

  const handleClick = async () => {

    const res = await SA_PayInvoice(inID)

    if (res.statusCode === 200) {
      toast.success("Sikeres fizetés!")
    } else {
      toast.error(res.statusMessage)
    }

  }

  return (
    <Button onClick={handleClick} className={className}>Fizetés</Button>
  )
}

export default PayInvoice