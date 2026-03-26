import { Feature } from "@/features/subscription/utils/types";
import { Session } from "next-auth";
import { permissionSchema } from "../lib/config";
import { subPermissionShema } from "../lib/subscriptionConfig";

export type Permissions = typeof permissionSchema
export type Resource = keyof Permissions
export type Action = ExtractSchemaActions<Permissions>

export type ExtractActions<R extends Resource> = keyof Permissions[R];

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type PermissionObject = Mutable<Partial<{
  [R in Resource]: ExtractActions<R>[]
}>>

export type GeneralPermissionObject = Mutable<Partial<{
  [R in Resource]: Action[]
}>>

export interface UserPermissions {
  [key: string]: PermissionObject;
}

export type ActionFunctionParams<R extends keyof typeof permissionSchema, A extends keyof Permissions[R]> =
  Permissions[R][A] extends (user: any, data: infer D) => any ? D : undefined;


export type ActionFunction = (user: Session["user"], data: any) => boolean
export type SubActionFunction = (feature: Feature, user: Session["user"], data: any) => boolean

export type ExtractSchemaActions<T> = T extends Record<string, infer U>
  ? U extends Record<string, true | ActionFunction>
  ? keyof U
  : never
  : never;

export type GoupItem = {
  url: string;
  title?: string;
  permissionCheck?: () => boolean;
  disableMenuItem?: true,
}

export type Group = {
  groupTitle: string,
  groupItems: GoupItem[],
  permissionCheck?: () => boolean;
}


export type SubPermissions = typeof subPermissionShema
export type SubResources = keyof SubPermissions

export type ExtractSubActions<R extends SubResources> = keyof SubPermissions[R];

export type SubActionFunctionParams<R extends keyof typeof subPermissionShema, A extends keyof SubPermissions[R]> =
  SubPermissions[R][A] extends (feature: Feature, user: any, data: infer D) => any ? D : undefined;
