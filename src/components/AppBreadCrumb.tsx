'use client'

import React, { Fragment } from 'react'
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb'
import { pages } from '@/utils/pages';

const AppBreadCrumb = () => {
  const pathname = usePathname();
  const paths = pathname.split('/');
  const breadcrumb: { url: string; title: string; }[] = [];
  let url = '';
  paths.map((item, index) => {
    if(index > 0) url += '/';
    pages.map((page) => {
      if(page.url == item) {
        url += page.url;
        breadcrumb.push({url, title: page.title});
      }
    });
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumb.map((item, index) => (
          <Fragment key={index}>
            {index < breadcrumb.length - 1 ? (
              <>
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink href={`${item.url}`}>
                    {item.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
              </>
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default AppBreadCrumb