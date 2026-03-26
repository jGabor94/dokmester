"use client"

import { hasPermission } from "@/features/authorization/utils";
import CompanySelector from "@/features/company/components/SelectCompany";
import { SelectCompany } from "@/features/company/utils/types";
import { generateMonogram } from "@/lib/utils";
import { BadgeCheckIcon, Building2Icon, ChevronsUpDownIcon, CirclePlus, CreditCardIcon, LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import { Switch } from "./ui/switch";

const NavUser = ({ companies, currentCompanyID }: { companies: SelectCompany[], currentCompanyID: string | null }) => {
  const { isMobile } = useSidebar();
  const { setTheme, theme } = useTheme()
  const { data: session } = useSession()

  if (session) return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={`https://xggzcmcnsswshhoqdrqq.supabase.co/storage/v1/object/public/images/avatar/${session.user.id}?updated=${Date.now()}`} />
                <AvatarFallback>{generateMonogram(session.user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{session.user.name}</span>
                <span className="truncate text-xs">{session.user.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              {companies.length > 1 && <CompanySelector companies={companies} currentcompanyid={currentCompanyID as string} />}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Label htmlFor="dark-mode" className="flex items-center justify-between font-normal w-full">
                  <div>Sötét mód</div>
                  <Switch id="dark-mode" checked={(theme == 'dark')} onCheckedChange={() => setTheme((theme == 'dark' ? 'light' : 'dark'))} />
                </Label>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href={`/dashboard/options/personal`} className={`flex gap-2 w-full`}>
                  <BadgeCheckIcon className={`w-5 h-5`} />
                  Fiókom
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/company/create`} className={`flex gap-2 w-full`}>
                  <CirclePlus className={`w-5 h-5`} />
                  Cég létrehozása
                </Link>
              </DropdownMenuItem>
              {hasPermission(session.user, "company", "update") ? (
                <>
                  <DropdownMenuItem>
                    <Link href={`/dashboard/options/company`} className={`flex gap-2 w-full`}>
                      <Building2Icon className={`w-5 h-5`} />
                      Cégem adatai
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/dashboard/options/subscription`} className={`flex gap-2 w-full`}>
                      <CreditCardIcon className={`w-5 h-5`} />
                      Előfizetésem
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <></>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ redirect: true, redirectTo: `` })} className={`text-red-500`}>
              <LogOutIcon />
              Kijelentkezés
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default NavUser