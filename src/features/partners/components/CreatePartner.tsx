"use client"

import { Button } from '@/components/ui/btn';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CircleFadingPlusIcon } from 'lucide-react';
import { FC, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SA_CreatePartner } from '../actions';
import { PartnerInputs } from '../utils/types';
import PartnerForm from './PartnerForm';

const CreatePartner: FC<{}> = () => {

  const [open, setOpen] = useState(false);

  const handleSubmit: SubmitHandler<PartnerInputs> = async (data) => {
    const res = await SA_CreatePartner(data)
    if (res.statusCode === 200) {
      toast.success("Partner sikeresen hozzáadva!");
      setOpen(false)
    } else if (res.statusCode === 400) {
      toast.error("Validációs hiba történt!");
    } else if (res.statusCode !== 500) {
      toast.error(res.error);
    } else {
      toast.error(res.statusMessage);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`flex gap-2`}>
          <CircleFadingPlusIcon />
          <span>Új partner felvitele</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Új partner hozzáadása</DialogTitle>
        </DialogHeader>
        <PartnerForm buttonTitle='Hozzáadás' onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

export default CreatePartner