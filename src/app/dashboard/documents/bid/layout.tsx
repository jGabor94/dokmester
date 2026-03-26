import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Új Árajánlat',
}

const BidsLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {children}
    </>
  )
}

export default BidsLayout