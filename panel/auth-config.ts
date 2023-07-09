import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "./env/server";
import Auth0 from "next-auth/providers/auth0";
// import Email from "next-auth/providers/email";
import { db } from "server/db";

export default {
    providers: [
        Auth0({
            clientId: env.AUTH0_CLIENT_ID,
            clientSecret: env.AUTH0_CLIENT_SECRET,
            issuer: env.AUTH0_ISSUER
        }),
        // Email({
        //     server: "",
        //     from: "",
        //     async sendVerificationRequest(params) {
        //         console.log(params);
        //     }
        // })
    ],
    adapter: PrismaAdapter(db),
    secret: env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/signin"
    }
};