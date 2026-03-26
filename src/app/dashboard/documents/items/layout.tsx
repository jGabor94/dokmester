import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Tételek',
}

const ItemsLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {children}
    </>
  )
}

export default ItemsLayout