'use client'
import { PDFDownloadLink } from '@react-pdf/renderer'
import React, { FC, useEffect, useState } from 'react'

const PDFDownloadButton: FC<{ document: React.ReactElement, children: React.ReactNode, filename: string, className? : string}> = ({ document, children, filename, className }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  })

  return (
    <>
      {isClient ? (
        <PDFDownloadLink document={document} fileName={filename} className={className}>
          {children}
        </PDFDownloadLink>
      ) : (
        <>
          {children}
        </>
      )}
    </>
  )
}

export default PDFDownloadButton