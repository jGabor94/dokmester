"use client"

import Spinner from '@/components/ui/spinner'
import { CheckCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'

const Success: FC<{ title: string, redirectTime?: number, redirectTo?: string }> = ({ title, redirectTime = 5000, redirectTo }) => {

  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push(redirectTo || "/login")
    }, redirectTime);
  }, [])

  return (
    <div className={`grid gap-3 border shadow-sm p-3 bg-card rounded-2xl max-w-md w-full mx-auto`}>
      <CheckCircleIcon className={`mx-auto text-emerald-500 size-16`} strokeWidth={1.5} />
      <h1 className='text-2xl text-center font-bold'>{title}</h1>
      <p className={`text-muted-foreground text-sm md:text-base text-center flex gap-2 items-center justify-center`}>
        Hamarosan átirányítunk <Spinner className={`w-5 h-5`} />
      </p>
    </div>
  )
}

export default Success