import { Button } from '@/components/ui/btn'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { auth } from '@/features/authentication/lib/auth'
import DeleteInvite from '@/features/company/components/DeleteInvite'
import InviteUser from '@/features/company/components/InviteUser'
import UsersList from '@/features/company/components/list'
import { getFullCompany } from '@/features/company/queries/getCompany'
import getInvites from '@/features/company/queries/getInvites'
import { CircleFadingPlusIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { FC } from 'react'

const page: FC<{}> = async () => {

  const session = await auth()

  if (!session || !session.user.companyID) redirect("/")

  const company = await getFullCompany(session.user.companyID)
  const invites = await getInvites(session.user.companyID)


  if (company) {
    return (
      <>
        <section>
          <header className={`mb-4 text-center md:text-start`}>
            <h1 className={`font-bold text-4xl`}>Felhasználók</h1>
          </header>
          <div className={`mb-4 flex gap-4`}>
            <Dialog>
              <DialogTrigger asChild>
                <Button className={`flex gap-2`}>
                  <CircleFadingPlusIcon />
                  <span>Új felhasználó</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Új felhasználó hozzáadása</DialogTitle>
                </DialogHeader>
                <InviteUser {...{ company }} />
              </DialogContent>
            </Dialog>
          </div>
        </section>
        {invites.length > 0 && (
          <section className={`mb-4`}>
            <h3 className={`font-bold text-lg mb-3`}>Meghívott felhasználók</h3>
            <div className="">
              <div className={`grid gap-3`}>
                {invites.map((invite, i) => (
                  <div key={invite.id} className={`border rounded-2xl bg-card shadow-sm p-3 flex gap-4 max-w-lg w-full justify-between items-center`}>
                    <p className={`text-sm md:text-base`}>{invite.email}</p>
                    <div>
                      <DeleteInvite inviteID={invite.id} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        <section className="">
          {invites.length > 0 && (<h3 className={`font-bold text-lg mb-3`}>Felhasználók</h3>)}
          <div className="">
            <UsersList users={company.users} selectedCompanyID={session.user.companyID} />
          </div>
        </section>
      </>
    )
  }
}

export default page