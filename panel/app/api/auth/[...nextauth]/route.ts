import NextAuth from "next-auth/next";
import { authOptions } from "server/auth";

const handler = (req: Request, res: Response) =>
    req
        ? NextAuth({
              ...authOptions(),
          })(req, res)
        : null;

export { handler as GET, handler as POST };
