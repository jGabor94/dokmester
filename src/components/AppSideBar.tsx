import { auth } from "@/features/authentication/lib/auth";
import { getDashboardRoutes } from "@/features/authorization/utils";
import { getCompaniesByUser } from "@/features/company/queries/getCompany";
import AppSideBarItem from "./AppSideBarItem";
import NavUser from "./NavUser";
import SidebarImage from "./SidebarImage";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarRail } from "./ui/sidebar";



const AppSideBar = async ({ ...props }: React.ComponentProps<typeof Sidebar>) => {

  const session = await auth();

  if (session) {

    const companies = await getCompaniesByUser(session.user.id)
    const sideBarMenu = getDashboardRoutes(session.user)

    return (
      <Sidebar {...props}>
        <SidebarHeader className={`mx-auto p-4`}>
          <SidebarImage />
        </SidebarHeader>
        <SidebarContent>
          {sideBarMenu.map(({ permissionCheck, ...group }) =>
            (!permissionCheck || (permissionCheck && permissionCheck())) ? (
              <SidebarGroup key={group.groupTitle} className="py-0 px-3">
                <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs">
                  {group.groupTitle}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.groupItems.map(({ permissionCheck, disableMenuItem, ...item }, index) =>
                      !disableMenuItem && (!permissionCheck || (permissionCheck && permissionCheck())) ? (
                        <AppSideBarItem key={index} {...{ item }} />
                      ) : null
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ) : null
          )}
        </SidebarContent>
        <SidebarFooter>
          <NavUser companies={companies} currentCompanyID={session.user.companyID} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
  }






}

export default AppSideBar