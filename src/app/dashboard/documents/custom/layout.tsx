import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Új Dokumentum',
}

const CustomsLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {children}
    </>
  )
}

export default CustomsLayout