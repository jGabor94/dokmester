import { FullUser } from "@/features/user/utils/types";
import { ActionFunction, ExtractSchemaActions, PermissionObject, Resource } from "../utils/types";

/*

Engedély séma. FONTOS! itt meg kell adni minden erőforrást és action-öt, lehetséges függvényekkel.

A következők miatt fontos a séma:
- Ez alapján történik az engedélyek ellenőrzése
- A séma alapján generálódik ki a jogosultság szerkesztő UI
- A séma alapján generálódik ki minden típus és egyéb konstans

*/

export const permissionSchema = {
  document: {
    list: true,
  },
  BID: {
    list: true,
    create: true,
    read: true,
    delete: true,
    send: true,
    update: true
  },
  CON: {
    list: true,
    create: true,
    read: true,
    delete: true,
    send: true,
    update: true
  },
  DEN: {
    list: true,
    create: true,
    read: true,
    delete: true,
    send: true,
    update: true
  },
  FER: {
    list: true,
    create: true,
    read: true,
    delete: true,
    send: true,
    update: true
  },
  INV: {
    list: true,
    create: true,
    read: true,
    delete: true,
    send: true,
    update: true
  },
  CUS: {
    list: true,
    create: true,
    read: true,
    delete: true,
    send: true,
    update: true
  },
  item: {
    create: true,
    read: true,
    update: true,
    delete: true
  },
  invite: {
    create: true,
    read: true,
    update: true,
    delete: true
  },
  subscription: {
    create: true,
    read: true,
    update: true,
    delete: true,
    pay: true
  },
  users: {
    create: true,
    read: true,
    update: (user, data: FullUser) => data.companies.some(company => user.companyID === company.id),
    delete: (user, data: FullUser) => data.companies.some(company => user.companyID === company.id)
  },
  employee: {
    create: true,
    read: true,
    update: true,
    delete: true
  },
  dayoff: {
    create: true,
    read: true,
    update: true,
    delete: true
  },
  wagepaper: {
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
  analytics: {
    create: true,
    read: true,
    update: true,
    delete: true
  },
  permission: {
    create: true,
    read: true,
    update: true,
    delete: true,
  },
  company: {
    delete: true,
    update: true
  }
} as const satisfies Record<string, Partial<Record<string, true | ActionFunction>>>


//Nem szerkeszthető engedélyek megadása
//Programkódba lehet ilyen engedély beszúrásokat tenni de a UI-on nincs lehetőség ezek módsoítására
export const persistPermissions: PermissionObject = {
  company: ["delete", "update"],
  permission: ["create", "read", "update", "delete"],
}


//Action-ök magyar fordítással A UI-hoz kell!
export const actions: Partial<Record<ExtractSchemaActions<Permissions>, string>> = {
  create: "Létrehozás",
  read: "Olvasás",
  update: "Módosítás",
  delete: "Törlés",
  list: "Listázás",
  send: "Küldés",
  pay: "Vásárlás",

}

//Erőforrások magyar fordítással. A UI-hoz kell!
export const resources: Partial<Record<Resource, string>> = {
  document: "Dokumentum",
  BID: "Árajánlat",
  CON: "Szerződés",
  DEN: "Szállítólevél",
  FER: "Díjbekérő",
  INV: "Számla",
  CUS: "Vásárlás",
  item: "Sablonok",
  invite: "Meghívó",
  subscription: "Előfizetés",
  users: "Felhasználók",
  employee: "Alkalmazott",
  dayoff: "Szabadság",
  wagepaper: "Bérpapír",
  partner: "Partner",
  analytics: "Analitika",
  permission: "Engedély",
  company: "Cég",
}


/*
  1-es 2-es 3-as 4-es 5-ös engedélykészleteket add meg kérlek
  Most csak beírtam random valamiket!!!
  Példa:
*/

export const _1: PermissionObject = {
  users: ["create", "read", "update", "delete"],
  document: ["list"],
  BID: ["create", "read", "delete", "send", "update", "send"],
}

export const _2: PermissionObject = {
  ..._1,
  CUS: ["create", "read", "update", "delete", "send"],
  INV: ["create", "read", "update", "delete", "send"],
  FER: ["create", "read", "update", "delete", "send"],
}

export const _3: PermissionObject = {
  ..._2,
  CON: ["create", "read", "update", "delete", "send"],
  DEN: ["create", "read", "update", "delete", "send"],
  analytics: ["read"],
}

export const _4: PermissionObject = {
  ..._3,
  item: ["create", "read", "update", "delete"],
  invite: ["create", "read", "update", "delete"],
  subscription: ["create", "read", "update", "delete", "pay"],
}

export const _5: PermissionObject = {
  ..._4,
  partner: ["create", "read", "update", "delete"],
  wagepaper: ["create", "read", "update", "delete"],
  dayoff: ["create", "read", "update", "delete"],
  employee: ["create", "read", "update", "delete"],
  analytics: ["create", "read", "update", "delete"],
}