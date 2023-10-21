import type { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: DefaultSession["user"] & {
            id: string;
            // ...other properties
            // role: UserRole;
        };
    }

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
}
