"use client"

import { useSession } from 'next-auth/react'
import { FC, useEffect, useState } from 'react'
import { SA_RefreshSession } from '../actions'

const ExpiredSessionCheck: FC<{}> = () => {

  const { data: session } = useSession()
  const [init, setInit] = useState(false)
  const intervalTime = Number(process.env.NEXT_PUBLIC_SESSION_CHECK_INTERVAL || 600000)

  useEffect(() => {
    if (!init && session && (session.user.lastUpdated + intervalTime < new Date().getTime())) {
      SA_RefreshSession()
      setInit(true)
    }
    const intervalId = setInterval(() => SA_RefreshSession(), intervalTime)
    return () => clearInterval(intervalId)
  }, [session])

  return null
}

export default ExpiredSessionCheck