import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, generateMonogram } from "@/lib/utils"
import { FC } from 'react'

const UserAvatar: FC<{ userID: string, name: string, className?: string }> = ({ userID, name, className }) => {

  return (
    <Avatar className={cn("w-10 h-10", className)} >
      <AvatarImage src={`https://xggzcmcnsswshhoqdrqq.supabase.co/storage/v1/object/public/images/avatar/${userID}?updated=${Date.now()}`} />
      <AvatarFallback>{generateMonogram(name)}</AvatarFallback>
    </Avatar >
  )
}

export default UserAvatar