import { Next } from '@/lib/serverAction/createServerAction/types'
import { createServerActionResponse } from '@/lib/serverAction/response'
import { Session } from 'next-auth'
import { permissionSchema } from '../lib/config'
import { feautureResources, subPermissionShema } from '../lib/subscriptionConfig'
import { ActionFunction, ActionFunctionParams, ExtractActions, ExtractSubActions, Group, Permissions, Resource, SubActionFunction, SubActionFunctionParams, SubPermissions, SubResources } from './types'


export const hasPermissionMiddleware = <
  R extends keyof typeof permissionSchema,
  A extends keyof Permissions[R]
>(
  resourceData: R | ((req: any) => Promise<R>),
  action: A,
  dataLoader?: (req: any) => Promise<ActionFunctionParams<R, A> | undefined>,
  errorMsg?: string
) => async (next: Next, req: { session: Session }) => {

  const data = dataLoader && await dataLoader(req)
  const resource = typeof resourceData === "function" ? await resourceData(req) : resourceData

  if (hasPermission(req.session.user, resource, action as any, data as any)) {
    return next()
  } else {
    return createServerActionResponse({ status: 403, error: errorMsg || "Nincs elegendő jogosultságod a művelethez!" })
  }
}

export const hasSubPermissionMiddleware = <
  R extends keyof typeof subPermissionShema,
  A extends keyof SubPermissions[R]
>(
  resourceData: R | ((req: any) => Promise<R>),
  action: A,
  dataLoader?: (req: any) => Promise<SubActionFunctionParams<R, A> | undefined>,
  errorMsg?: string
) => async (next: Next, req: { session: Session }) => {

  const data = dataLoader && await dataLoader(req)
  const resource = typeof resourceData === "function" ? await resourceData(req) : resourceData

  if (hasSubPermission(req.session.user, resource, action as any, data as any)) {
    return next()
  } else {
    return createServerActionResponse({ status: 403, error: errorMsg || "Nincs elegendő jogosultságod a művelethez!" })
  }
}



export function hasPermission<
  R extends Resource,
  A extends ExtractActions<R>
>(
  user: Session["user"],
  resource: R,
  action: A,
  data?: ActionFunctionParams<R, A>
) {

  if (user.permissions[resource] && user.permissions[resource].includes(action)) {

    const target = permissionSchema[resource][action]

    if (typeof target === "boolean") {
      return true
    } else {
      return (target as ActionFunction)(user, data)
    }

  }

  return false;
}


export function hasSubPermission<
  R extends SubResources,
  A extends ExtractSubActions<R>
>(
  user: Session["user"],
  resource: R,
  action: A,
  data?: SubActionFunctionParams<R, A>
) {

  if (!user.feature) return false

  const permissions = feautureResources[user.feature][resource] as Record<string, true | SubActionFunction>;

  if (!permissions) return false

  if (action in permissions) {
    const permissionValue = permissions[action as string];

    if (typeof permissionValue === "function") {
      return permissionValue(user.feature, user, data);
    }

    return permissionValue;
  }
  return false;
}


export const getDashboardRoutes = (user: Session["user"]): Group[] => [
  {
    groupTitle: 'Műveletek',
    groupItems: [
      { url: '/dashboard/documents/bid', title: 'Új Árajánlat', permissionCheck: () => hasPermission(user, "BID", "create") },
      { url: '/dashboard/documents/fee_request', title: 'Új Díjbekérő', permissionCheck: () => hasPermission(user, "FER", "create") },
      { url: '/dashboard/documents/delivery_note', title: 'Új Szállítólevél', permissionCheck: () => hasPermission(user, "DEN", "create") },
      { url: '/dashboard/documents/invoice', title: 'Számla', permissionCheck: () => hasPermission(user, "INV", "list") },
      { url: '/dashboard/documents/invoice/create', permissionCheck: () => hasPermission(user, "INV", "create"), disableMenuItem: true },
      { url: '/dashboard/documents/custom', title: 'Új Egyedi Sablon', permissionCheck: () => hasPermission(user, "CUS", "create") },
    ],
    permissionCheck: () => hasSubPermission(user, "document", "read") && hasPermission(user, "BID", "create") || hasPermission(user, "DEN", "create") || hasPermission(user, "item", "create") || hasPermission(user, "INV", "create") || hasPermission(user, "FER", "create") || hasPermission(user, "CUS", "create")
  },
  {
    groupTitle: 'Alapvető funkciók',
    groupItems: [
      { url: '/dashboard', title: 'Vezérlőpult' },
      {
        url: '/dashboard/documents', title: 'Dokumentumok', permissionCheck: () => hasSubPermission(user, "document", "read") || hasPermission(user, "document", "list")
      },
    ],
  },

  /*{
    groupTitle: 'Munkavállalók',
    groupItems: [
      { url: '/dashboard/workers', title: 'Munkavállalók' },
      { url: '/dashboard/workers/day_offs', title: 'Szabadnapok' },
      { url: '/dashboard/workers/payroll', title: 'Bérszámfejtés' },
    ],
    permissionCheck: () => hasPermission(user, "SUB_employee", "read") && hasPermission(user, "employee", "read")
  },*/
  {
    groupTitle: 'Adatkezelés',
    groupItems: [
      { url: '/dashboard/documents/items', title: 'Tételek kezelése', permissionCheck: () => hasPermission(user, "item", "create") && hasPermission(user, "item", "create") },
      { url: '/dashboard/partners', title: 'Partnerek kezelése', permissionCheck: () => hasPermission(user, "partner", "read") && hasPermission(user, "partner", "read") },
      { url: '/dashboard/options/users', title: 'Felhasználók kezelése', permissionCheck: () => hasPermission(user, "users", "read") && hasPermission(user, "users", "read") },
    ],
  },
  {
    groupTitle: 'Cég és fiókkezelés',
    groupItems: [
      { url: '/dashboard/options/company', title: 'Cégem adatai', permissionCheck: () => hasPermission(user, "company", "update") },
      { url: '/dashboard/options/personal', title: 'Fiókom' },
      { url: '/dashboard/options/subscription', title: 'Előfizetésem', permissionCheck: () => hasPermission(user, "subscription", "update") },
    ],
  },
];


/*
export function hasPermission<Resource extends keyof Permissions>(
  user: Session["user"],
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) {

  return true
  return user.roles.some(role => {
    const rolePermissions = (ROLES as RolesWithPermissions)[role][resource]
    if (!rolePermissions) return false

    const permission = rolePermissions[action] ?? rolePermissions["all"]

    if (permission == null) return false

    if (typeof permission === "boolean") return permission

    return data != null && permission(user, data)
  })
}
  */