import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'pl'],
    // locales: ['en'],
    localePrefix: 'never',
    // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
    defaultLocale: 'en'
});

export const config = {
    // Skip all paths that should not be internationalized. This example skips the
    // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
    // matcher: ['/((?!api|auth|registration|results|stopwatch|timer|_next|.*\\..*).*)']
    matcher: ['/((?!api|_next/static|assets|favicon|fonts|sw.js|_next/image|favicon.ico).*)']
    // matcher: ['/((?!api|_next|.*\\..*).*)']
};