import Success from '@/components/Success'
import { Button } from '@/components/ui/btn'
import JoinToCompany from '@/features/authentication/components/JoinToCompany'
import { db } from '@/lib/drizzle/db'
import { invitesTable, usersTable, userToCompanyTable } from '@/lib/drizzle/schema'
import { eq, sql } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { CircleX } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

const page: FC<{ params: Promise<{ token: string }> }> = async ({ params }) => {

  const { token } = await params
  const { inviteID } = jwt.verify(token, process.env.JWT_SECRET as string) as { inviteID: string }

  const invite = await db.query.invitesTable.findFirst({
    where: eq(invitesTable.id, inviteID),
    with: {
      company: true
    }
  })

  if (invite) {

    const userExist = await db.query.usersTable.findFirst({ where: eq(usersTable.email, invite.email) });
    if (userExist) {
      await db.insert(userToCompanyTable).values({ userID: userExist.id, companyID: invite.companyID })
      await db.update(usersTable).set({
        permissions: sql`jsonb_set(permissions::jsonb, ${sql.param(`{${invite.companyID}}`)}, ${sql.param('{}')})::json`,
      }).where(eq(usersTable.email, invite.email))
      await db.delete(invitesTable).where(eq(invitesTable.id, invite.id))

      return <Success title={`Sikeresen csatlakoztál a következő céghez: ${invite.company.name}!`} />
    }

    return (
      <div className='flex flex-col gap-4 w-[400px] max-w-full'>
        <h1 className={`text-2xl font-bold`}>Csatlakozás ide: {invite.company.name}</h1>
        <div className={`grid gap-4 border shadow-sm p-3 bg-card rounded-2xl w-full`}>
          <JoinToCompany invite={invite} />
        </div>
      </div>

    )
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <p className='text-3xl'>Meghívó nem található</p>
      <CircleX width={120} height={120} color="#c62828" />
      <Link href="/">
        <Button >
          Főoldal
        </Button>
      </Link>
    </div>
  )

}

export default page