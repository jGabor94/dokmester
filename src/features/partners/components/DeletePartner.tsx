"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/btn';
import { Trash2Icon } from 'lucide-react';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { SA_DeletePartner } from '../actions';
import { SelectPartner } from '../utils/types';

const DeletePartner: FC<{ partner: SelectPartner }> = ({ partner }) => {

  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    const res = await SA_DeletePartner(partner.id);
    if (res.statusCode === 200) {
      toast.success("Partner sikeresen hozzáadva!");
      setOpen(false)
    } else if (res.statusCode !== 500) {
      toast.error(res.error);
    } else {
      toast.error(res.statusMessage);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={`destructive`} size={`icon`}><Trash2Icon /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Biztosan törlöd ezt a partnert?</AlertDialogTitle>
          <AlertDialogDescription>
            {partner.name}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Nem</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Igen</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}

export default DeletePartner