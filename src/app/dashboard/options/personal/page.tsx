import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/features/authentication/lib/auth";
import { allowedImageExtenstions, allowedImageSize } from "@/features/image/lib/imageExtensions";
import DeleteAccount from "@/features/user/components/DeleteAccount";
import EditUser from "@/features/user/components/EditUser";
import PasswordChange from "@/features/user/components/PasswordChange";
import UpdateAvatar from "@/features/user/components/UpdateAvatar";
import { getFullUser } from "@/features/user/queries";
import { FC } from "react";


const UserPage: FC<{}> = async () => {

  const session = await auth()
  const user = await getFullUser(session?.user.email as string)

  if (user) {
    return (
      <>
        <section>
          <header className={`mb-4 text-center md:text-start`}>
            <h1 className={`font-bold text-4xl`}>Fiókom</h1>
          </header>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col px-2 md:px-10 gap-4 items-center">
              <UpdateAvatar user={user} validation={{ extensions: allowedImageExtenstions, size: allowedImageSize, imageNumber: 1 }} />
              <div className="h-[1px] bg-slate-300 w-full" />
              {user.companies.map((company) => (
                <div key={company.id} className="flex flex-row items-center text-sm gap-4 self-start">
                  <Avatar className="w-12 h-12 object-cover">
                    <AvatarImage src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/images/${company.logo}`} className="object-contain" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span>{company.name}</span>

                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4  md:max-w-[500px] md:w-full">
              <div className={`border p-3 rounded-2xl bg-card max-w-full shadow-sm w-full`}>
                <EditUser user={user} />
              </div>
              <div className={`border p-3 rounded-2xl bg-card max-w-full shadow-sm w-full`}>
                <PasswordChange />
              </div>
              <div className={`border p-3 rounded-2xl bg-card max-w-full shadow-sm w-full`}>
                <DeleteAccount user={user} />
              </div>

            </div>

          </div>

        </section>
      </>
    )
  }
}

export default UserPage