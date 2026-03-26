import { auth } from "@/features/authentication/lib/auth"
import { BookCopyIcon, Building2Icon, FileTextIcon, HandCoinsIcon, HomeIcon, LayoutDashboardIcon, LogInIcon, SettingsIcon, UserPlusIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import MenuListDesktop from "./MenuListDesktop"
import MenuListMobile from "./MenuListMobile"
import { buttonVariants } from "../btn"
import SidebarImage from "@/components/SidebarImage"

const Navbar = async () => {

  const session = await auth()

  const navLinks = [
    { href: '/', title: 'Kezdőlap', icon: <HomeIcon className={`mx-auto`} /> },
    { href: '/packages', title: 'Csomagjaink', icon: <BookCopyIcon className={`mx-auto`} /> },
    { href: '/about', title: 'Rólunk', icon: <Building2Icon className={`mx-auto`} /> },
  ];

  if (session?.user) {
    navLinks.splice(0, navLinks.length);
    navLinks.push(
      { href: '/dashboard', title: 'Vezérlőpult', icon: <LayoutDashboardIcon className={`mx-auto`} /> },
      { href: '/dashboard/documents', title: 'Dokumentumok', icon: <FileTextIcon className={`mx-auto`} /> },
      { href: '/dashboard/documents/bids', title: 'Árajánlatok', icon: <HandCoinsIcon className={`mx-auto`} /> },
      { href: '/dashboard/options', title: 'Beállítások', icon: <SettingsIcon className={`mx-auto`} /> },
    );
  }

  return (
    <nav>
      <div className={`hidden md:block bg-background fixed top-0 left-0 w-full py-3 shadow-lg z-50`}>
        <div className={`flex justify-between items-center w-full px-4`}>
          <Link href={`/`}>
            <SidebarImage className={`max-w-64`}/>
          </Link>
          <ul className={`flex justify-end items-center gap-4`}>
            <MenuListDesktop listItems={navLinks} />
            {!session?.user ? (
              <>
                <li>
                  <Link href={`/login`} className={`${buttonVariants({variant: 'default'})}`}>
                    Bejelentkezem
                  </Link>
                </li>
                <li>
                  <Link href={`/register`} className={`${buttonVariants({variant: 'outline'})}`}>
                    Regisztrálok
                  </Link>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>
      </div>
      <div className={`block md:hidden fixed bottom-0 left-0 w-full p-4`}>
        <div className={`border w-full shadow-sm bg-card rounded-2xl p-3 z-50`}>
          <div className={`flex gap-4 items-center justify-between`}>
            {session?.user ? (
              <>
                <MenuListMobile listItems={navLinks} />
              </>
            ) : (
              <>
                <MenuListMobile listItems={[
                  { href: '/login/', title: 'Bejelentkezés', icon: <LogInIcon className={`mx-auto`} /> },
                  { href: '/register/', title: 'Regisztráció', icon: <UserPlusIcon className={`mx-auto`} /> },
                  ...navLinks,
                ]} />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar