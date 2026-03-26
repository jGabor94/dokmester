"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, JSX } from 'react';
import { buttonVariants } from '../btn';
import { cn } from '@/lib/utils';

const MenuListMobile: FC<{ listItems: { href: string, title: string, icon: JSX.Element }[] }> = ({ listItems }) => {
  return (
    <>
      {listItems.map(item => (
        <Link key={item.href} href={item.href} className={`${cn(buttonVariants({variant: 'ghost', size: 'icon'}))}`}>
          {item.icon}
        </Link>
      ))
      }
    </>

  )
}

export default MenuListMobile