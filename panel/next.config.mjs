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

// await import("./env.js");
// import { env } from "env";

import NextIntlPlugin from "next-intl/plugin";
import BundleAnalizer from "@next/bundle-analyzer";

const withBundleAnalyzer = BundleAnalizer({
    enabled: process.env.ANALYZE === "true",
});

const withNextIntl = NextIntlPlugin(
    // This is the default (also the `src` folder is supported out of the box)
    "./i18n/index.ts",
);

// export default withPWA(defineNextConfig({
export default withBundleAnalyzer(
    withNextIntl(
        defineNextConfig({
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
            eslint: {
                ignoreDuringBuilds: true,
            },
            // rewrites() {
            //     return [{ source: "/api/trpc/:path*", destination: "http://localhost:3001/:path*" }];
            //     // return env.NEXT_PUBLIC_NODE_ENV === "production"
            //     //     ? [{ source: "/api/trpc/:path*", destination: "http://localhost:3001/:path*" }]
            //     //     : [];
            // },

            // experimental: {
            //     runtime: "nodejs",
            //     // appDir: true,
            // },
        }),
    ),
);
