'use client'

import { Button } from '@/components/ui/btn'
import { CircleX } from 'lucide-react'
import Link from 'next/link'

export default function Error({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className='flex flex-col items-center gap-4'>
      <p className='text-3xl'>
        {error.message === "jwt expired" ? "Token lejárt" : "Valami hiba történt"}
      </p>
      <CircleX width={120} height={120} color="#c62828" />
      <Link href="/">
        <Button >
          Főoldal
        </Button>
      </Link>

    </div>

  )
}