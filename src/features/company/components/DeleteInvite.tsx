"use client"

import { cn } from '@/utils/cn'
import { Trash2Icon, TrashIcon, X } from 'lucide-react'
import { FC } from 'react'
import toast from 'react-hot-toast'
import { SA_DeleteInvite } from '../actions'
import { Button } from '@/components/ui/btn'

const DeleteInvite: FC<{ className?: string, inviteID: string }> = ({ className, inviteID }) => {

  const handleDelete = async () => {

    const res = await SA_DeleteInvite(inviteID)

    if (res.statusCode === 200) {
      toast.success('Meghvó törölve!');
    } else {
      toast.error(res.statusMessage);
    }
  }

  return (
    <>
      <Button variant={`destructive`} size={`icon`} onClick={handleDelete} className={cn(className, "cursor-pointer")} >
        <Trash2Icon />
      </Button>
    </>
    
  )
}

export default DeleteInvite