"use client"

import { Button } from '@/components/ui/btn';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PencilIcon } from 'lucide-react';
import { FC, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SA_UpdatePartner } from '../actions';
import { PartnerInputs, SelectPartner } from '../utils/types';
import PartnerForm from './PartnerForm';

const UpdatePartner: FC<{ partner: SelectPartner }> = ({ partner }) => {

  const [open, setOpen] = useState(false);

  const handleSubmit: SubmitHandler<PartnerInputs> = async (data) => {
    const res = await SA_UpdatePartner(data);

    if (res.statusCode === 200) {
      toast.success("Partner sikeresen frissítve!");
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
        <Button variant={`outline`} size={`icon`}><PencilIcon /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Partner szerkesztése</DialogTitle>
        </DialogHeader>
        <PartnerForm buttonTitle='Mentés' onSubmit={handleSubmit} defaultValues={{
          name: partner?.name,
          taxnumber: partner?.taxnumber,
          groupMemberTaxNumber: partner.groupMemberTaxNumber,
          communityVatNumber: partner.communityVatNumber,
          zip: partner?.zip,
          city: partner?.city,
          address: partner?.address,
          email: partner?.email,
          mobile: partner?.mobile,
        }} />
      </DialogContent>
    </Dialog>
  )
}

export default UpdatePartner