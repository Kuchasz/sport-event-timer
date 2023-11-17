import { stackMiddlewares } from "middlewares/stack-handler";
import { withIntl } from "middlewares/with-intl";
// import { withAuth } from "./middlewares/with-auth";

const middlewares = [
    // withAuth,
    withIntl,
];
export default stackMiddlewares(middlewares);

// const intlMiddleware = createMiddleware({
//     locales,
//     localePrefix: "never",
//     defaultLocale: "en",
// });

// export const middleware = (request: NextRequest) => {
//     // console.log(JSON.stringify(request.nextUrl));
//     //eslint-disable-next-line @typescript-eslint/no-unsafe-return
//     return intlMiddleware(request as any);
// };

// export const config = {
//     // Skip all paths that should not be internationalized. This example skips the
//     // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
//     // matcher: ['/((?!api|auth|registration|results|stopwatch|timer|_next|.*\\..*).*)']
//     matcher: ["/((?!api|auth|_next|assets|favicon|fonts|sw.js|favicon.ico).*)"],
//     // matcher: ['/((?!api|_next|auth|_vercel|.*\\..*).*)']
//     // matcher: ['/((?!api|_next|.*\\..*).*)']
// };
