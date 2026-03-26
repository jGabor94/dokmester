import { Next } from '@/lib/serverAction/createServerAction/types'
import { createServerActionResponse } from '@/lib/serverAction/response'
import { Session } from 'next-auth'
import { auth } from '../lib/auth'

export const isLogged = async (next: Next, req: { session: Session }) => {
  const session = await auth()
  if (session) {
    req.session = session
    return next()
  } else {
    return createServerActionResponse({ status: 401, error: "Nem vagy bejelentkezve" })
  }
}

export const genVerifyCode = () => Math.floor(100000 + Math.random() * 900000);
