import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Partnerek - DokMester',
}

const PartnersLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {children}
    </>
  )
}

export default PartnersLayout