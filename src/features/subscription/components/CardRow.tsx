import { formatCardExpDate } from '@/lib/utils'
import { CircleCheck } from 'lucide-react'
import Image from 'next/image'
import { FC } from 'react'
import { Pm } from '../utils/types'

const CardRow: FC<{ pm: Pm, defaultPaymentMethod?: string }> = ({ pm, defaultPaymentMethod }) => {

  return (
    <div key={pm.id} className="flex flex-row gap-4 items-center text-sm ">
      <Image src={`/icons/${pm.brand}.png`} alt="" width={25} height={10} />
      <div key={pm.id} className="flex flex-row gap-2 items-center ">
        <span> **** **** **** {pm.last4}</span>
        |
        <span>{pm.expMonth && pm.expYear && formatCardExpDate(pm.expMonth, pm.expYear)}</span>
      </div>
      {defaultPaymentMethod === pm.id && <CircleCheck className='h-5' color="#43a047" />}
    </div>
  )
}

export default CardRow