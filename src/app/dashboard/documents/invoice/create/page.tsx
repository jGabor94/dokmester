import { auth } from '@/features/authentication/lib/auth'
import { getFullCompany } from '@/features/company/queries/getCompany'
import { genDocName } from '@/features/documents/queries'
import CreateInvoice from '@/features/invoice/components/createInvoice'
import { redirect } from 'next/navigation'
import { FC } from 'react'

const InvoicesPage: FC<{}> = async () => {

  const session = await auth();

  if (!session || !session.user.companyID) return redirect("/")

  const company = await getFullCompany(session.user.companyID);
  const docName = await genDocName('INV', session.user.companyID);

  if (company && session) return (
    <CreateInvoice company={company} issuerEmail={session.user.email} />
  )
}

export default InvoicesPage