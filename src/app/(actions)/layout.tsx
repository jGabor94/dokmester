import Image from 'next/image'
import Link from 'next/link'
import { FC, ReactNode } from 'react'

const layout: FC<{ children: ReactNode }> = ({ children }) => {

  return (
    <div className='min-h-screen flex items-center justify-center relatuve px-4'>
      {children}
      <Link href="/">
        <Image src={`/Banner.png`} width={254} height={48} alt="DokMester banner" className='fixed bottom-6 right-6' />
      </Link>
    </div>

  )
}

export default layout