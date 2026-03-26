"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/btn'
import { Trash } from 'lucide-react'
import { FC, useState } from 'react'
import { SA_DeleteInvoice } from '../actions'

const DeleteInvoice: FC<{ invoiceID: string }> = ({ invoiceID }) => {

  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    await SA_DeleteInvoice(invoiceID)
    setLoading(false)
  }

  return (

    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" loading={loading} className={`flex items-center gap-2 text-nowrap`} disabled={loading} >
          <Trash strokeWidth={1.5} /><span>Törlés</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Biztos szeretnéd törölni ezt a dokumentumot?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Mégse</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Törlés</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}

export default DeleteInvoice