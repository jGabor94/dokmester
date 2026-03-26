import { auth } from '@/features/authentication/lib/auth'
import { getFullCompany } from '@/features/company/queries/getCompany'
import Main from '@/features/documents/components/bid/main'
import { redirect } from 'next/navigation'
import { FC } from 'react'

const BidsPage: FC<{}> = async () => {

  const session = await auth();

  if (!session || !session.user.companyID) return redirect("/")

  const company = await getFullCompany(session.user.companyID);

  if (company && session) return (
    <Main company={company} issuerEmail={session.user.email} />
  )
}

export default BidsPage