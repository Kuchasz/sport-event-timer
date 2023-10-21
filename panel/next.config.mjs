/** @type {import('next').NextConfig} */

// import withPWAModule from 'next-pwa';

// const withPWA = withPWAModule({
// dest: 'public',
// });

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
    return config;
}

await import("./panel/env.mjs");

import NextIntlPlugin from 'next-intl/plugin';

const withNextIntl = NextIntlPlugin(
    // This is the default (also the `src` folder is supported out of the box)
    './i18n/index.ts'
);

// export default withPWA(defineNextConfig({
export default withNextIntl(defineNextConfig({
    // reactStrictMode: true,
    // swcMinify: true,
    // i18n: {
    //     locales: ["en", "pl"],
    //     defaultLocale: "en",
    // },
    poweredByHeader: false,
    // redirects: async () => {
    //     return [{ source: '/', destination: '/panel', permanent: true }]
    // }

    experimental: {
        // runtime: 'nodejs',
        appDir: true
    }
}));