import { auth } from '@/features/authentication/lib/auth'
import { db } from '@/lib/drizzle/db'
import { comapniesMetaTable } from '@/lib/drizzle/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { FC } from 'react'
import { formatFileSize } from '../utils'
import plansConfig from '../utils/plansConfig'



const UsedSpace: FC<{ feature: string }> = async ({ feature }) => {

  const session = await auth()

  if (!session) return redirect("/login")

  const companyMeta = await db.query.comapniesMetaTable.findFirst({ where: eq(comapniesMetaTable.companyID, session?.user.companyID as string) })

  if (!companyMeta) return null

  return (
    <div className='flex flex-col p-2 gap-2 text-sm'>
      <div className='w-full h-1 bg-gray-200'>
        <div className='h-full bg-primary' style={{ width: `${(companyMeta.usedSpace / plansConfig[feature].storage > 1 ? 1 : companyMeta.usedSpace / plansConfig[feature].storage) * 100}%` }} />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 ">
          <span className="font-semibold">Felhasznált</span>
          <span className="text-zinc-600">{formatFileSize(companyMeta?.usedSpace)}</span>
        </div>
        <div className="flex flex-col gap-1 ">
          <span className="font-semibold">Csomag tárhely</span>
          <span className="text-zinc-600">{formatFileSize(plansConfig[feature].storage)}</span>
        </div>

      </div>


    </div>


  )
}

export default UsedSpace