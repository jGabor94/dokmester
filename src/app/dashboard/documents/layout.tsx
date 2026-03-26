import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: {
    default: 'Dokumentumok - DokMester',
    template: '%s - DokMester'
  }
}

const DocumentsLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {children}
    </>
  )
}

export default DocumentsLayout