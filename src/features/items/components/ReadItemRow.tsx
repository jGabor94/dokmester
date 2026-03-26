"use client"

import { Button } from '@/components/ui/btn'
import { PencilIcon } from 'lucide-react'
import { Dispatch, FC, SetStateAction } from 'react'
import { SelectItems } from '../utils/types'

const ReadItemRow: FC<{ item: SelectItems, setMode: Dispatch<SetStateAction<"read" | "edit">> }> = ({ item, setMode }) => {

  return (
    <div key={item.id} className={`border p-3 rounded-2xl relative flex justify-between items-center text-left gap-3 bg-card shadow-sm`}>
      <p className={`font-bold sm:w-1/2 break-words`}>{item.name}</p>
      <p className={`hidden md:block`}>{item.unitPrice.toLocaleString('hu-HU')} Ft / {item.unit}</p>
      <p className={`hidden md:block`}>{item.vatkey}</p>
      <p className={`hidden sm:block`}>{item.createdAt.toLocaleDateString('hu-HU')}</p>
      <Button variant={`outline`} size={'icon'} onClick={() => setMode("edit")} className={`flex items-center gap-2`}><PencilIcon strokeWidth={1.5} /></Button>
    </div>
  )
}

export default ReadItemRow