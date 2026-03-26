import AppBreadCrumb from "@/components/AppBreadCrumb";
import AppSideBar from "@/components/AppSideBar";
import { CustomTrigger } from "@/components/AppSideBarTrigger";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Vezérlőpult',
}

const DashboardLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {

  return (
    <SidebarProvider>
      <AppSideBar />
      <SidebarInset>
        <header className="hidden md:flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <AppBreadCrumb />
          </div>
        </header>
        <main className="flex flex-1 flex-col px-4 mt-4">
          {children}
        </main>
        <CustomTrigger />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout