"use client"

import { Button } from '@/components/ui/btn'
import { TrashIcon } from 'lucide-react'
import { FC } from 'react'
import { SA_DeleteItems } from '../actions'

const DeleteItem: FC<{ itemID: string }> = ({ itemID }) => {
  return (
    <>
      <Button onClick={() => SA_DeleteItems(itemID)} variant={`destructive`} size={`icon`}><TrashIcon strokeWidth={1.5} /></Button>
    </>

  )
}

export default DeleteItem