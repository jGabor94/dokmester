'use client'
import Spinner from '@/components/ui/spinner'
import { PDFViewer } from '@react-pdf/renderer'
import React, { FC, useEffect, useState } from 'react'

const PDFViewerContainer: FC<{ document: React.ReactElement, className?: string }> = ({ document, className }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  })

  return (
    <>
      {isClient ? (
        <PDFViewer className={className}>
          {document}
        </PDFViewer>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default PDFViewerContainer