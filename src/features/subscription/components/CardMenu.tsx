"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import SA_DeletePaymentMethod from "@/features/subscription/actions/deletePaymentMethod"
import SA_UpdatedSubPm from '@/features/subscription/actions/updatedSubPm'
import { Pm } from '@/features/subscription/utils/types'
import { CircleCheck, EllipsisVertical, Trash } from 'lucide-react'
import { FC, useState } from 'react'
import toast from 'react-hot-toast'
import CardRow from "./CardRow"

const CardMenu: FC<{ pm: Pm, subID?: string }> = ({ pm, subID }) => {

  const [open, setOpen] = useState(false)

  const handleSetAsDefault = async () => {
    const res = await SA_UpdatedSubPm(subID as string, pm.id)
    if (res.statusCode === 200) {
      toast.success("Kártya beállítva elsődeleges fizetési módként")
    } else {
      toast.error(res.statusMessage)
    }
  }

  const handleDelete = async () => {
    const res = await SA_DeletePaymentMethod(pm.id)
    if (res.statusCode === 200) {
      toast.success('Kártya törölve')
    } else {
      toast.error('Hiba történt')
    }
  }


  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Biztos szeretnéd törölni ezt a bankártyát?</AlertDialogTitle>
            <CardRow pm={pm} />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Mégse</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Törlés</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="cursor-pointer h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {subID && (
            <DropdownMenuItem onClick={handleSetAsDefault}>
              <div className="flex flex-row justify-between items-center w-full">
                <span>
                  Alapértelmezett
                </span>
                <CircleCheck className="h-4" />
              </div>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <div className="flex flex-row justify-between items-center w-full" onClick={() => setOpen(true)}>
              <span>
                Törlés
              </span>
              <Trash className="h-4" />
            </div>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </>

  )
}

export default CardMenu