"use client"

import { Button } from "@/components/ui/btn"
import { imageValidationCfg } from "@/features/image/utils/types"
import validateImage from "@/features/image/utils/validateImage"
import { ValidationErrors } from "@/features/image/utils/validationError"
import imageCompression from 'browser-image-compression'
import { TrashIcon, Upload } from "lucide-react"
import { ChangeEventHandler, FC, useRef, useState } from 'react'
import toast from "react-hot-toast"
import { SA_DeleteAvatar, SA_UpdateAvatar } from "../actions/actions"
import { FullUser } from "../utils/types"
import UserAvatar from "./Avatar"

const UpdateAvatar: FC<{ user: FullUser, validation: imageValidationCfg }> = ({ user, validation }) => {

  const [src, setSrc] = useState(`https://xggzcmcnsswshhoqdrqq.supabase.co/storage/v1/object/public/images/avatar/${user.id}?updated=${Date.now()}`)
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setLoading1(true)
    if (e.target.files?.length) {
      const file = e.target.files[0]
      try {
        setSrc(URL.createObjectURL(file))
        validateImage(file, validation)
        const compressedImage = await imageCompression(file, {
          maxSizeMB: 3,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        })

        const res = await SA_UpdateAvatar(compressedImage)

        if (res.statusCode === 200) {
          toast.success("Profilképed sikeresen módosult");
        } else if (res.statusCode !== 500) {
          toast.error(res.error);
        } else {
          toast.error(res.statusMessage);
        }

      } catch (err) {
        if (err instanceof ValidationErrors) {
          toast.error((
            <ul className='list-disc ml-5'>
              {err.messages.map((message, index) => (
                <li key={index} className='my-1'>{message}</li>
              ))}
            </ul>
          ))
        }
      }

    }
    setLoading1(false)
  }

  const handleDelete = async () => {

    setLoading2(true)

    setSrc(`https://xggzcmcnsswshhoqdrqq.supabase.co/storage/v1/object/public/images/avatar/${user.id}?updated=${Date.now()}`)

    const res = await SA_DeleteAvatar()

    if (res.statusCode === 200) {
      toast.success("Profilképed sikeresen eltávolítva");
    } else if (res.statusCode !== 500) {
      toast.error(res.error);
    } else {
      toast.error(res.statusMessage);
    }

    setLoading2(false)

  }

  return (
    <div className="flex flex-col gap-4">
      <UserAvatar name={user.name} userID={user.id} className="w-48 h-48" />
      <div className="flex flex-row gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <Button
          className="cursor-pointer hover:bg-accent"
          size="sm"
          variant="secondary"
          onClick={handleClick}
          loading={loading1}
          disabled={loading1 || loading2}
        >
          <Upload strokeWidth={1.75} />
          Feltöltés
        </Button>


        <Button
          className="cursor-pointer hover:bg-accent"
          size="sm"
          variant="secondary"
          onClick={handleDelete}
          loading={loading2}
          disabled={loading1 || loading2}

        >
          <TrashIcon strokeWidth={1.75} />
          Törlés
        </Button>
      </div>
    </div>



  )
}

export default UpdateAvatar