"use client"

import { Button } from '@/components/ui/btn'
import SA_CancelSubscription from '@/features/subscription/actions/cancelSubscription'
import { FC, useState } from 'react'

const CancelSubscription: FC<{ subID: string }> = ({ subID }) => {

  const [loading, setLoading] = useState(false)

  const handleCancelSubscription = async () => {
    setLoading(true)
    await SA_CancelSubscription(subID)
    setLoading(false)
  }

  return (
    <Button variant="outline" loading={loading} onClick={handleCancelSubscription} disabled={loading} >Lemondás</Button>
  )
}

export default CancelSubscription