// Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs

// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { env } from "../env";
// import type { GetServerSidePropsContext } from "next";
// import type { NextAuthOptions } from "next-auth";
// import { getServerSession } from "next-auth";
// import Auth0 from "next-auth/providers/auth0";
// import { db } from "./db";

// Next API route example - /pages/api/restricted.ts
// export const getServerAuthSession = async (ctx: { req: GetServerSidePropsContext["req"]; res: GetServerSidePropsContext["res"] }) => {
//     return await getServerSession(ctx.req, ctx.res, authOptions());
// };

// export const authOptions = () =>
//     ({
//         callbacks: {
//             session: ({ session, user }) => ({
//                 ...session,
//                 user: {
//                     ...session.user,
//                     id: user.id,
//                 },
//             }),
//         },
//         providers: [
//             Auth0({
//                 clientId: env.AUTH0_CLIENT_ID,
//                 clientSecret: env.AUTH0_CLIENT_SECRET,
//                 issuer: env.AUTH0_ISSUER,
//             }),
//         ],
//         adapter: PrismaAdapter(db),
//         secret: env.NEXTAUTH_SECRET,
//         pages: {
//             signIn: "/auth/signin",
//         },
//     }) as NextAuthOptions;
