import { Button } from '@/components/ui/btn'
import { CircleX } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

const Page: FC<{}> = () => (
  <div className='flex flex-col items-center gap-4'>
    <p className='text-3xl'>Nincs jogosultásgod az oldal megtekintéséhez.</p>
    <CircleX width={120} height={120} color="#c62828" />
    <Link href="/">
      <Button >
        Főoldal
      </Button>
    </Link>
  </div>
)

export default Page
