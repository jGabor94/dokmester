"use client"

import { Button } from '@/components/ui/btn'
import { SelectInvoice } from '@/features/invoice/lib/types'
import { PrinterIcon } from 'lucide-react'
import { FC, useState } from 'react'
import { SA_GetDocument } from '../actions'

const PrintDocument: FC<{ document: SelectInvoice }> = ({ document }) => {

  const [loading, setLoading] = useState(false)

  const handlePDFPrint = async () => {
    setLoading(true)
    const res = await SA_GetDocument(document.fileName)
    if (res.statusCode === 200) {
      const typedBlob = new Blob([res.payload], { type: "application/pdf" });
      const url = URL.createObjectURL(typedBlob);
      const newWindow = window.open(url);
      if (newWindow) {
        newWindow.onload = () => {
          newWindow.print()
          URL.revokeObjectURL(url)
        };
      }
    }

    setLoading(false)
  }

  return (
    <Button variant={`outline`} loading={loading} className={`flex items-center gap-2 text-nowrap`} onClick={handlePDFPrint} disabled={loading}>
      <PrinterIcon strokeWidth={1.5} /><span>Nyomtatás</span>
    </Button>
  )
}

export default PrintDocument