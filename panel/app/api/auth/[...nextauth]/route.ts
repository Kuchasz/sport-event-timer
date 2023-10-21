import NextAuth from "next-auth/next";
import { authOptions } from "server/auth";

const handler = (req: Request, res: Response) =>
    req
        ? //eslint-disable-next-line @typescript-eslint/no-unsafe-call
          (NextAuth({
              ...authOptions(),
          })(req, res) as unknown)
        : null;

export { handler as GET, handler as POST };
