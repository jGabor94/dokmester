import { getDashboardRoutes } from "@/features/authorization/utils";
import { getFullUser } from "@/features/user/queries";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthConfig } from "next-auth";
import { getToken } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { NextResponse } from "next/server";



export const authConfig = {
  providers: [],
  callbacks: {
    async authorized({ auth, request }) {

      const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })


      if (request.nextUrl.pathname.startsWith("/dashboard")) {
        if (token?.userData) {
          const allowedRoute = getDashboardRoutes(token.userData).find((group) => {
            if (!group.permissionCheck || group.permissionCheck()) {
              return group.groupItems.find(item => {
                if (request.nextUrl.pathname === item.url) {
                  return !item.permissionCheck || item.permissionCheck();
                }
                return false;
              });
            }
            return false;
          });

          if (allowedRoute) return true;

          return NextResponse.redirect(new URL("/permission/denided", request.nextUrl));

        }
        return NextResponse.redirect(new URL("/login", request.nextUrl));
      }

      if (token?.userData && (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register"))) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
      }

      return true

    },

  }


} satisfies NextAuthConfig;

export const { auth, handlers: { GET, POST }, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  session: {
    strategy: 'jwt'
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = await getFullUser(credentials.email as string)
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(credentials?.password as string, user.password);
        if (!passwordMatch) return null;
        return user
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {


      if (trigger === "update" && session) {
        return { ...token, userData: { ...session.user, lastUpdated: new Date().getTime() } }
      }


      if (user) {

        const feature = user.companies[0] ? user.companies[0].subscription.feature ? user.companies[0].subscription.feature : null : null

        return {
          ...token, userData: {
            id: user.id,
            companyID: user.companies[0].id,
            customerID: user.companies[0].subscription.customerID,
            name: user.name,
            email: user.email,
            permissions: user.permissions[user.companies[0].id],
            lastUpdated: new Date().getTime(),
            feature
          },
        }
      }

      return { ...token }

    },
    async session({ session, token }) {

      return { ...session, user: { ...session.user, ...token.userData } };
    }
  }
})