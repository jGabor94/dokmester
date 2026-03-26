import { auth } from '@/features/authentication/lib/auth'
import { getFullCompany } from '@/features/company/queries/getCompany'
import Main from '@/features/documents/components/custom/main'
import { genDocName } from '@/features/documents/queries'
import { redirect } from 'next/navigation'
import { FC } from 'react'

const CustomsPage: FC<{}> = async () => {

  const session = await auth();

  if (!session || !session.user.companyID) return redirect("/")

  const company = await getFullCompany(session.user.companyID);
  const docName = await genDocName('CUS', session.user.companyID);

  if (company && session) return (
    <Main company={company} issuerEmail={session.user.email} docName={docName} />
  )
}

export default CustomsPage