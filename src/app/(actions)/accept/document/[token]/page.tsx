import { DocType } from '@/features/documents/lib/types/document'
import { acceptDocMailMap } from '@/features/email/utils'
import { db } from '@/lib/drizzle/db'
import { documentsTable } from '@/lib/drizzle/schema'
import { and, eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { CircleCheckBig, TriangleAlert } from 'lucide-react'
import { FC } from 'react'

const page: FC<{ params: Promise<{ token: string }> }> = async ({ params }) => {

  const { token } = await params

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { docID: string, type: DocType }
  const [doc] = await db.update(documentsTable).set({ state: "accepted" }).where(and(eq(documentsTable.id, decoded.docID), eq(documentsTable.state, "sended"))).returning()

  if (doc) {

    await acceptDocMailMap[doc.type](doc)

    return (
      <div className='flex flex-col items-center gap-4'>
        <p className='text-3xl'>
          {doc.type === "BID" && "Árajánlat "}
          {doc.type === "DEN" && "Szálíítólevél "}
          elfogadva</p>
        <p >E-mail-ben értesítettük a kiállítót</p>
        <CircleCheckBig width={120} height={120} color="#00c853" />
      </div>
    )

  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <p className='text-3xl'>Ezt az
        {decoded.type === "BID" && " árajánlatot "}
        {decoded.type === "DEN" && " szállítólevelet "}
        már elfogadták</p>
      <TriangleAlert width={120} height={120} color="#ff8f00" />
    </div>
  )






}

export default page