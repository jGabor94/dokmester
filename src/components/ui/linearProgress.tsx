import { cn } from '@/lib/utils'
import { FC } from 'react'

const LinearProgress: FC<{ className?: string }> = ({ className }) => {

  return (
    <div className={cn('w-full', className)}>
      <div className='h-0.5 w-full bg-pink-100 overflow-hidden'>
        <div className='animate-progress w-full h-full bg-curious-blue-500 origin-left-right'></div>
      </div>
    </div>
  )
}

export default LinearProgress