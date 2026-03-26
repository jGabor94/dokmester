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
import { Button } from "@/components/ui/btn"
import { SA_DeleteUserFromCompany } from "@/features/user/actions/actions"
import { SelectUser } from "@/features/user/utils/types"
import { Trash } from "lucide-react"
import { FC, useState } from 'react'
import toast from "react-hot-toast"

const DeleteUser: FC<{ user: SelectUser }> = ({ user }) => {

  const [loading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    const res = await SA_DeleteUserFromCompany(user.id)
    if (res.statusCode === 200) {
      toast.success('Céges adatok frissítve!');
    } else if (res.statusCode !== 500) {
      toast.error(res.error);
    } else {
      toast.error(res.statusMessage);
    }
    setIsLoading(false)

  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" >
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Biztos szeretnéd törölni ezt a usert?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Mégse</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>Törlés</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteUser