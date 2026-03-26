"use client"

import { Button, buttonVariants } from '@/components/ui/btn'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { FullCompany } from '@/features/company/utils/types'
import { SA_GenDocName } from '@/features/documents/actions'
import PDFViewerContainer from '@/features/documents/components/pdf/PDFViewer'
import { Invoice } from '@/features/documents/components/pdf/schema/Invoice'
import { getDocName, PDFBlob } from '@/features/documents/utils/client'
import { FileSearchIcon } from 'lucide-react'
import { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { SA_SaveInvoice } from '../actions'
import { SelectInvoice } from '../lib/types'


const CreateStorno: FC<{ invoice: SelectInvoice, company: FullCompany }> = ({ invoice, company }) => {

  const [loading, setLoading] = useState(false)

  const canceledData = { ...invoice.data, items: invoice.data.items.map(item => ({ ...item, quantity: -item.quantity })) }

  const handleClick = async () => {
    const res1 = await SA_GenDocName('INV')
    if (res1.statusCode === 200) {

      const pdf = await PDFBlob({ document: <Invoice data={canceledData} title={`${invoice.name} sztornó számlája`} name={getDocName(company, 'INV')} color={company.color ?? "#13a4ec"} logo={company.logo} /> })

      const res2 = await SA_SaveInvoice(canceledData, pdf, invoice.id, "STORNO")
      setLoading(true)
      if (res2.statusCode === 200) {
        toast.success(`Sztornó számla sikeresen kiálítva!`)
      } else if (res2.statusCode !== 500) {
        toast.error(res2.error);
      } else {
        toast.error(res2.statusMessage);
      }

    } else if (res1.statusCode !== 500) {
      toast.error(res1.error);
    } else {
      toast.error(res1.statusMessage);
    }

    setLoading(false)

  }

  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button variant={`outline`} loading={loading} disabled={loading}>
          Sztornó számla
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[600px] ' >
        <DialogHeader>
          <DialogTitle>{invoice.name} sztornózása</DialogTitle>
          <DialogDescription>
            <Dialog>
              <DialogTrigger className={`${buttonVariants({ variant: 'outline' })}`}>
                <FileSearchIcon />
                <span>Előnézet</span>
              </DialogTrigger>
              <DialogContent className={`max-h-[90dvh] max-w-[90dvw] md:max-w-[640px] h-full w-full rounded-2xl sm:rounded-2xl p-3`}>
                <DialogHeader className={`space-y-0`}>
                  <DialogTitle className={`mb-4 text-lg`}>Számla előnézete</DialogTitle>
                  <PDFViewerContainer document={<Invoice data={canceledData} title={`${invoice.name} sztornó számlája`} name={getDocName(company, 'INV')} color={company.color ?? "#13a4ec"} logo={company.logo} />} className={`h-full w-full`} />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleClick}>Mentés</Button>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  )
}

export default CreateStorno