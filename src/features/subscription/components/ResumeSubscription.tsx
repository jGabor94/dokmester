"use client"

import { Button } from '@/components/ui/btn'
import { FC, useState } from 'react'
import SA_ResumeSubscription from '../actions/resumeSubscription'

const ResumeSubscription: FC<{ subID: string }> = ({ subID }) => {

  const [loading, setLoading] = useState(false)

  const handleResumeSubscription = async () => {
    setLoading(true)
    await SA_ResumeSubscription(subID)
    setLoading(false)
  }

  return (
    <Button variant="outline" loading={loading} onClick={handleResumeSubscription} disabled={loading} >Folytatás</Button>
  )
}

export default ResumeSubscription