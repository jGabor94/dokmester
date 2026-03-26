import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Új Szállítólevél',
}

const DeliveryNotesLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {children}
    </>
  )
}

export default DeliveryNotesLayout