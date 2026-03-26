import Success from '@/components/Success'
import { FC } from 'react'

const page: FC<{ searchParams: Promise<{ [key: string]: string | undefined }> }> = async ({ searchParams }) => {

  const redirectTime = (await searchParams).redirectTime
  const title = (await searchParams).title
  const redirectTo = (await searchParams).redirectTo

  return (
    <Success title={title ? title : ""} redirectTime={redirectTime ? Number(redirectTime) : undefined} redirectTo={redirectTo && decodeURIComponent(redirectTo)} />
  )
}

export default page