import plansConfig from "@/features/subscription/utils/plansConfig";
import { Feature } from "@/features/subscription/utils/types";
import { SubActionFunction, SubPermissions, SubResources } from "../utils/types";


//Engedély séma. FONTOS! itt meg kell adni minden erőforrást és action-öt, lehetséges függvényekkel.
export const subPermissionShema = {
  dashboard: {
    read: true
  },
  companyColor: {
    update: true
  },
  companyLogo: {
    update: true,
    delete: true
  },
  report: {
    create: true,
    read: true,
    update: true,
    delete: true
  },
  document: {
    create: (feature, user, data) => (data.usedSpace + data.newFileSize) < plansConfig[feature].storage,
    read: true,
    delete: true,
    save: true
  },
  users: {
    read: true,
    create: (feature, user, userNumber: number) => userNumber < plansConfig[feature].userNumber
  },
  mail: {
    send: true
  },
  hideWaterMark: {
    hide: true
  },
  tag: {
    create: true,
    read: true,
    update: true,
    delete: true
  },
  partner: {
    create: true,
    read: true,
    update: true,
    delete: true
  },
  autoProcess: {
    create: true,
    read: true,
    update: true,
    delete: true
  },
  item: {
    create: true,
    read: true,
    update: true,
    delete: true
  },
  employee: {
    create: true,
    read: true,
    update: true,
    delete: true
  },
} as const satisfies Record<string, Record<string, true | SubActionFunction>>


//Engedély konfig csomagok szerint
export const feautureResources: Record<Feature, Partial<Record<SubResources, SubPermissions[SubResources]>>> = {
  "basic": {
    dashboard: subPermissionShema.dashboard,
    document: subPermissionShema.document,
    companyColor: subPermissionShema.companyColor,
    companyLogo: subPermissionShema.companyLogo,
    report: subPermissionShema.report,
  },
  "premium": {
    dashboard: subPermissionShema.dashboard,
    document: subPermissionShema.document,
    companyColor: subPermissionShema.companyColor,
    companyLogo: subPermissionShema.companyLogo,
    report: subPermissionShema.report,
    mail: subPermissionShema.mail,
    hideWaterMark: subPermissionShema.hideWaterMark,
    tag: subPermissionShema.tag,
    users: subPermissionShema.users,
    partner: subPermissionShema.partner,
    item: subPermissionShema.item,
    employee: subPermissionShema.employee,
  },
  "business": {
    dashboard: subPermissionShema.dashboard,
    document: subPermissionShema.document,
    companyColor: subPermissionShema.companyColor,
    companyLogo: subPermissionShema.companyLogo,
    report: subPermissionShema.report,
    mail: subPermissionShema.mail,
    hideWaterMark: subPermissionShema.hideWaterMark,
    tag: subPermissionShema.tag,
    users: subPermissionShema.users,
    partner: subPermissionShema.partner,
    item: subPermissionShema.item,
    employee: subPermissionShema.employee,
    autoProcess: subPermissionShema.autoProcess,
  }
}

