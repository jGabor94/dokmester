"use client"

import { Button } from '@/components/ui/btn'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import Tag from '@/components/ui/Tag'
import { SelectUser } from '@/features/user/utils/types'
import { PencilIcon } from 'lucide-react'
import { FC, MouseEventHandler, useState } from 'react'
import toast from 'react-hot-toast'
import { SA_UpdatePermissions } from '../action'
import { _1, _2, _3, _4, _5, actions, persistPermissions, resources } from '../lib/config'
import { permissionsArray, persistPermissionsArray } from '../lib/constants'
import { Action, GeneralPermissionObject, Resource } from '../utils/types'


const UpdatePermissions: FC<{ user: SelectUser, companyID: string }> = ({ user, companyID }) => {

  const [loading, setLoading] = useState(false)
  const [userPermissions, setUserPermissions] = useState<GeneralPermissionObject>(user.permissions[companyID])

  const handleCheckChange = (checked: string | boolean, resource: Resource, action: Action) => {

    setUserPermissions(state => {
      if (!checked) {
        state[resource] = state[resource]?.filter(a => a !== action)
        if (state[resource]?.length === 0) {
          delete state[resource]
        }
        return { ...state }
      } else {
        state[resource] = state[resource] ? [...state[resource], action] : [action]
        return { ...state }
      }

    })
  }

  const onSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await SA_UpdatePermissions(user.id, userPermissions)
    if (res.statusCode === 200) {
      toast.success('Felhasználói engedélyek sikeresen frissítve!');
    } else if (res.statusCode !== 500) {
      toast.error(res.error);
    } else {
      toast.error(res.statusMessage);
    }
    setLoading(false)
  }

  const handlePermissionGroupChange = (group: GeneralPermissionObject) => {

    persistPermissionsArray.forEach(({ name, actions }) => {
      actions.forEach(action => {

        if ((user.permissions[companyID] as GeneralPermissionObject)[name]?.includes(action)) {
          group[name] = group[name] ? [...group[name], action] : [action]
        }

        if (!(user.permissions[companyID] as GeneralPermissionObject)[name]?.includes(action)) {
          if (group[name] && group[name]?.includes(action)) {
            group[name] = group[name]?.filter(a => a !== action)
          }
        }

      })
    })

    setUserPermissions({ ...group })
  }


  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button variant={`outline`} size={`icon`} title="Jogkörök módosítása" ><PencilIcon /></Button>
      </DialogTrigger>
      <DialogContent className='fixed h-screen overflow-y-scroll'>
        <DialogHeader>
          <DialogTitle>Jogkörök módosítása</DialogTitle>
        </DialogHeader>
        <div className={`flex gap-3 items-center`}>
          <Tag color={`warning`} className='cursor-pointer' onClick={() => handlePermissionGroupChange(_1)}>1-ES</Tag>
          <Tag color={`alert`} className='cursor-pointer' onClick={() => handlePermissionGroupChange(_2)}>2-ES</Tag>
          <Tag color={`sended`} className='cursor-pointer' onClick={() => handlePermissionGroupChange(_3)}>3-AS</Tag>
          <Tag color={`success`} className='cursor-pointer' onClick={() => handlePermissionGroupChange(_4)}>4-ES</Tag>
          <Tag color={`disabled`} className='cursor-pointer' onClick={() => handlePermissionGroupChange(_5)}>5-ES</Tag>

        </div>
        <form className={`h-max`} >
          {permissionsArray.map((resource, index) => (
            <div key={index} className={`mb-4 border p-3 rounded-lg bg-background shadow-sm`}>
              <p className={`font-bold mb-2`}>{resources[resource.name]}</p>
              <div className={`flex flex-wrap justify-start items-center gap-x-4 gap-y-3`}>
                {resource.actions.map((action, index) => (
                  <Label key={index} htmlFor="dark-mode" className="flex items-center justify-start gap-2">
                    <Checkbox
                      id="create"
                      disabled={(persistPermissions as GeneralPermissionObject)[resource.name]?.includes(action)}
                      checked={userPermissions[resource.name]?.includes(action)}
                      onCheckedChange={(checked) => handleCheckChange(checked, resource.name, action)} />
                    <div>{actions[action]}</div>
                  </Label>
                ))}

              </div>
            </div>
          ))}
          <Button onClick={onSubmit} loading={loading} disabled={loading}>Módosítás</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdatePermissions