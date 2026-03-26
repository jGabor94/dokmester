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
import { Input } from '@/components/ui/inpt'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { TrashIcon } from 'lucide-react'
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from "react-hot-toast"
import { SA_DeleteAccount } from "../actions/actions"
import { createDeleteAccountSchema } from '../lib/zodSchema'
import { DeleteAccountSchema, FullUser } from '../utils/types'


const DeleteAccount: FC<{ className?: string, user: FullUser }> = ({ className, user }) => {

  const router = useRouter()

  const form = useForm<DeleteAccountSchema>({
    mode: "all",
    resolver: zodResolver(createDeleteAccountSchema(user.name))
  })

  const onSubmit: SubmitHandler<DeleteAccountSchema> = async (data) => {
    const res = await SA_DeleteAccount()

    if (res.statusCode === 200) {
      form.reset()
      await signOut({ redirect: true, redirectTo: `/success?title=Account sikeresen törölve&redirectTo=${encodeURIComponent("/")}` })
    } else if (res.statusCode === 400) {
      console.log(res.error)
    } else {
      toast.error(res.statusMessage);
    }
  }

  return (
    <div className={`flex flex-col gap-4`} >
      <div>
        <label htmlFor={`confirmMessage`} className={`mb-1 text-xs`}>Törlés megerősítéséhez gépelje be a következőt: <b>"{user.name}"</b></label>
        <Input type="text" id="confirmMessage" {...form.register("confirmMessage")} />
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className={cn(className)} loading={form.formState.isSubmitting} disabled={!form.formState.isValid || form.formState.isSubmitting}>
            <TrashIcon />
            Fiók törlése
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Biztos szeretnéd törölni ezt a usert?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel >Mégse</AlertDialogCancel>
            <AlertDialogAction onClick={() => form.handleSubmit(onSubmit)()}>Törlés</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DeleteAccount