import { stackMiddlewares } from "./middlewares/stack-handler";
import { withIntl } from "./middlewares/with-intl";
import { withAuth } from "./middlewares/with-auth";

const middlewares = [withIntl, withAuth];
export default stackMiddlewares(middlewares);

// export const config = {
//     // Skip all paths that should not be internationalized. This example skips the
//     // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
//     // matcher: ['/((?!api|auth|registration|results|stopwatch|timer|_next|.*\\..*).*)']
//     matcher: ["/((?!api|auth|_next|assets|favicon|fonts|sw.js|favicon.ico).*)"],
//     // matcher: ['/((?!api|_next|auth|_vercel|.*\\..*).*)']
//     // matcher: ['/((?!api|_next|.*\\..*).*)']
// };
