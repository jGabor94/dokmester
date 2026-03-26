import PasswordChangeForm from '@/features/authentication/components/PasswordChangeForm'
import jwt from 'jsonwebtoken'
import { FC } from 'react'

const page: FC<{ params: Promise<{ token: string }> }> = async ({ params }) => {

  const { token } = await params

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userID: string }

  return (
    <PasswordChangeForm userID={decoded.userID} />
  )



}

export default page