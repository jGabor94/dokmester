"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { SelectInvoice } from "@/features/invoice/lib/types"
import { InfoIcon } from 'lucide-react'
import { FC } from 'react'

const NavInfo: FC<{ navErrors: NonNullable<SelectInvoice["navErrors"]> }> = ({ navErrors }) => {


  return (
    <Dialog >
      <DialogTrigger asChild>
        <InfoIcon />
      </DialogTrigger>
      <DialogContent className='h-screen overflow-y-scroll w-[600px] ' >
        <DialogHeader>
          <DialogTitle>NAV adatszolgáltatás információk</DialogTitle>

        </DialogHeader>
        <div className='flex flex-col gap-2 '>
          <div>
            <h1 className='text-3xl'>Hibák</h1>
            <div className="text-sm flex flex-col gap-2">
              {navErrors.errors.map((error, index) => (
                <div className="flex flex-row gap-2 " key={index}>
                  <span className="font-bold">{index + 1}</span>
                  <span>{error}</span>
                </div>

              ))}
            </div>

          </div>
          <div>
            <h1 className='text-3xl'>XML</h1>
            {navErrors.xml && <span className="text-sm">{Buffer.from(navErrors.xml, 'base64').toString()}</span>}
          </div>
        </div>
      </DialogContent>
    </Dialog>

  )
}

export default NavInfo