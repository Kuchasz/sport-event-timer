import NextAuth, { type NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../../../env/server.js";
import { db } from "server/db";

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_ISSUER
    }),
    EmailProvider({
      server: "",
      from: "",
      async sendVerificationRequest(params) {
        console.log(params);
      }
    })
  ],
  adapter: PrismaAdapter(db),
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin"
  }
};

export default NextAuth(authOptions);