import { Action, ExtractActions, Resource } from "../utils/types";
import { permissionSchema, persistPermissions } from "./config";

export const permissionSet = Object.entries(permissionSchema).reduce((acc, [resource, resourceASctions]) => {
  return { ...acc, [resource]: Object.keys(resourceASctions) as Action[] }
}, {} as { [R in Resource]: ExtractActions<R>[] });

export const permissionsArray = Object.entries(permissionSchema).map(([resource, resourceASctions]) => ({
  name: resource as Resource,
  actions: Object.keys(resourceASctions) as Action[],
}));

export const persistPermissionsArray = Object.entries(persistPermissions).map(([resource, resourceASctions]) => ({
  name: resource as Resource,
  actions: resourceASctions as Action[],
}))

