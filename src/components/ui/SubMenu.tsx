"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { Tabs, TabsList, TabsTrigger } from "./tabs";

const SubMenu: FC<{ menuList: { label: string, href: string, section: string }[] }> = ({ menuList }) => {

  const pathname = usePathname()

  return (
    <section className={`hidden md:block`}>
      <Tabs defaultValue={pathname} className={`w-fit `}>
        <TabsList>
          {menuList.map((item) => (
            <TabsTrigger value={item.href} key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </section>
  )
}

export default SubMenu