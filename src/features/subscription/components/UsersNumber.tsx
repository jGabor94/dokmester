import { auth } from '@/features/authentication/lib/auth'
import { db } from '@/lib/drizzle/db'
import { comapniesMetaTable } from '@/lib/drizzle/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { FC } from 'react'
import plansConfig from '../utils/plansConfig'



const UsersNumber: FC<{ feature: string }> = async ({ feature }) => {

  const session = await auth()

  if (!session) return redirect("/login")

  const companyMeta = await db.query.comapniesMetaTable.findFirst({ where: eq(comapniesMetaTable.companyID, session?.user.companyID as string) })

  if (!companyMeta) return null

  return (
    <div className='flex flex-col p-2 gap-2 text-sm w-full'>
      <div className='w-full h-1 bg-gray-200'>
        <div className='h-full bg-primary' style={{ width: `${(companyMeta.usersNumber / plansConfig[feature].userNumber > 1 ? 1 : companyMeta.usersNumber / plansConfig[feature].userNumber) * 100}%` }} />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 ">
          <span className="font-semibold">Jelenleg</span>
          <span className="text-zinc-600">{companyMeta.usersNumber} db.</span>
        </div>
        <div className="flex flex-col gap-1 ">
          <span className="font-semibold">Maximum</span>
          <span className="text-zinc-600">{plansConfig[feature].userNumber} db.</span>
        </div>

      </div>


    </div>


  )
}

export default UsersNumber