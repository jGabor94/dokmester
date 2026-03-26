"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'
import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'

const AppSideBarItem: FC<{
  item: {
    url: string;
    title?: string;
  }
}> = ({ item }) => {

  const pathname = usePathname();

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild tooltip={item.title} isActive={pathname == item.url}>
        <Link href={item.url}>
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default AppSideBarItem