import LoginForm from '@/features/authentication/components/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bejelentkezés - DokMester',
}

const LoginPage = () => {
  return (
    <main className={`h-svh grid items-center px-4 pt-4 md:pt-0`}>
      <LoginForm />
    </main>
  )
}

export default LoginPage