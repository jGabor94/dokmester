import Spinner from '@/components/ui/spinner'
import { FC } from 'react'

const loading: FC<{}> = () => {

  return (
    <div className='flex justify-center items-center h-[400px] w-full'>
      <Spinner />
    </div>
  )
}

export default loading