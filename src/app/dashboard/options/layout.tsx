import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Beállítások - DokMester',
}

const OptionsLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {children}
    </>
  )
}

export default OptionsLayout