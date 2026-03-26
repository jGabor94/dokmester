"use client"

import { Button } from '@/components/ui/btn'
import { SelectInvoice } from '@/features/invoice/lib/types'
import { DownloadIcon } from 'lucide-react'
import { FC, useState } from 'react'
import { SA_GetDocument } from '../actions'

const DownloadDocument: FC<{ document: SelectInvoice }> = ({ document }) => {

  const [loading, setLoading] = useState(false)

  const handlePDFDownload = async () => {


    setLoading(true)
    const res = await SA_GetDocument(document.fileName)

    if (res.statusCode === 200) {
      const typedBlob = new Blob([res.payload], { type: "application/pdf" });
      const url = URL.createObjectURL(typedBlob);

      const a = window.document.createElement("a");
      a.href = url;
      a.download = document.name + ".pdf";
      window.document.body.appendChild(a);
      a.click();

      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setLoading(false)
    }

  }

  return (
    <Button variant={`outline`} loading={loading} className={`flex items-center gap-2 text-nowrap`} onClick={handlePDFDownload} disabled={loading}>
      <DownloadIcon strokeWidth={1.5} /><span>Letöltés</span>
    </Button>
  )
}

export default DownloadDocument