"use client"

import Link from 'next/link';
import { FC, JSX } from 'react';
import { buttonVariants } from '../btn';

const MenuListDesktop: FC<{ listItems: { href: string, title: string, icon: JSX.Element }[] }> = ({ listItems }) => {
  return (
    <>
      {listItems.map(item => (
        <li key={item.href}>
          <Link href={item.href} className={`${buttonVariants({ variant: 'ghost' })}`}>
            {item.title}
          </Link>
        </li>
      ))}
    </>
  )
}

export default MenuListDesktop