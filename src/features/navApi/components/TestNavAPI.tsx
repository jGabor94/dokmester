"use client"

import { Button } from '@/components/ui/btn'
import { SA_ManageInvoice, SA_RequestExchnageToken } from '@/features/navApi/actions'
import { FC, useState } from 'react'
import toast from 'react-hot-toast'

const TestNavAPI: FC<{}> = () => {

  const [loading, setLoading] = useState(false)

  const requestExchnageToken = async () => {
    setLoading(true)

    const res = await SA_RequestExchnageToken()

    if (res.statusCode === 200) {
      console.log(res.payload)
    } else if (res.statusCode !== 500) {
      toast.error(res.error);
    } else {
      toast.error(res.statusMessage);
    }
    setLoading(false)
  }


  const requestManageInvoice = async () => {
    setLoading(true)

    const res = await SA_ManageInvoice()

    if (res.statusCode === 200) {
      console.log(res.payload)
    } else if (res.statusCode !== 500) {
      toast.error(res.error);
    } else {
      toast.error(res.statusMessage);
    }
    setLoading(false)
  }


  return (
    <div className='flex flex-row gap-4'>
      <Button loading={loading} disabled={loading} onClick={requestExchnageToken}>Csere token igénylés</Button>
      <Button loading={loading} disabled={loading} onClick={requestManageInvoice}>Invoice operáció</Button>
    </div>
  )
}

export default TestNavAPI