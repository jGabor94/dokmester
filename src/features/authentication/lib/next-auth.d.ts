import { PermissionObject } from "@/features/authorization/utils/types";
import { Feature } from "@/features/subscription/utils/types";
import { FullUser } from "@/features/user/utils/types";
import "next-auth";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";
import { DefaultJWT } from "next-auth/jwt";

interface TokenUserData {
    id: string,
    companyID: string | null,
    customerID: string | null,
    name: string,
    permissions: PermissionObject,
    email: string,
    lastUpdated: number,
    feature: Feature | null
}

declare module "next-auth" {
    interface Session extends DefaultSession { user: TokenUserData }
    interface User extends FullUser { }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT { userData: TokenUserData }
}

