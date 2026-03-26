'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import React, { HTMLAttributes} from 'react'

const SidebarImage = (props?: HTMLAttributes<HTMLDivElement>) => {
  const { theme } = useTheme()
  return (
    <div className={props?.className}>
      {theme == 'dark' ? <Image src={`/Banner_White.png`} width={793} height={150} alt="DokMester logó" className={`w-full`} /> : <Image src={`/Banner.png`} width={793} height={150} alt="DokMester logó" className={`w-full`} /> }
    </div>
  )
}

export default SidebarImage