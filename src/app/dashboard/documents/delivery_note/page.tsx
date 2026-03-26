import { auth } from '@/features/authentication/lib/auth'
import { getFullCompany } from '@/features/company/queries/getCompany'
import DeliveryNoteMain from '@/features/documents/components/delivery_note/DeliveryNoteMain'
import { genDocName } from '@/features/documents/queries'
import { redirect } from 'next/navigation'
import { FC } from 'react'

const DeliveryNotesPage: FC<{}> = async () => {

  const session = await auth();

  if (!session || !session.user.companyID) return redirect("/")

  const company = await getFullCompany(session.user.companyID);
  const docName = await genDocName('DEN', session.user.companyID);

  if (company && session) return (
    <DeliveryNoteMain company={company} docName={docName} issuerEmail={session.user.email} />
  )
}

export default DeliveryNotesPage