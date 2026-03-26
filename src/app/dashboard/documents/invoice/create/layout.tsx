import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Új számla',
}

const InvoicesLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {children}
    </>
  )
}

export default InvoicesLayout