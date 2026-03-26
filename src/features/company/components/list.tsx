"use client"

import { Button } from "@/components/ui/btn"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import UpdatePermissions from "@/features/authorization/components/UpdatePermissions"
import { SA_DeleteUserFromCompany } from '@/features/user/actions/actions'
import UserAvatar from "@/features/user/components/Avatar"
import { SelectUser } from '@/features/user/utils/types'
import { Trash2Icon } from "lucide-react"
import { FC } from 'react'
import toast from 'react-hot-toast'

const UsersList: FC<{ users: SelectUser[], selectedCompanyID: string }> = ({ users, selectedCompanyID }) => {

  const handleDelete = async (deleteID: string) => {
    const res = await SA_DeleteUserFromCompany(deleteID)
    if (res.statusCode === 200) {
      toast.success('Felhasználó sikeresen törölve!');
    } else if (res.statusCode !== 500) {
      toast.error(res.error);
    } else {
      toast.error(res.statusMessage);
    }
  }



  return (
    <>
      <section className={`grid gap-3`}>
        {users.map((user, i) => (
          <div key={i} className={`bg-card rounded-2xl p-3 border shadow-sm text-sm grid xl:grid-cols-5 items-center gap-y-3 gap-x-4`}>
            <div className='flex flex-row gap-2 items-center'>
              <UserAvatar name={user.name} userID={user.id} />
              <span className={`font-bold`}>{user.name}</span>
            </div>
            <div className={``}>{user.email}</div>

            <div className={`flex items-center justify-center gap-4 border-t pt-3 md:justify-end md:border-t-0 md:pt-0`}>
              <UpdatePermissions user={user} companyID={selectedCompanyID} />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={`destructive`} size={`icon`} title="Felhasználó törlése"><Trash2Icon /></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Biztosan törlöd ezt a felhasználót?</DialogTitle>
                  </DialogHeader>
                  <div className={`grid grid-cols-1 gap-4 h-max`}>
                    <div>
                      <p>{user.name}</p>
                    </div>
                    <div className={`flex gap-4 justify-end items-center`}>
                      <DialogTrigger asChild>
                        <Button variant={`outline`}>Mégse</Button>
                      </DialogTrigger>
                      <DialogTrigger asChild>
                        <Button variant={`destructive`} onClick={() => handleDelete(user.id)}>Törlés</Button>
                      </DialogTrigger>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}

export default UsersList