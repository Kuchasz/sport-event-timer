const withPWA = require("next-pwa");
/** @type {import('next').NextConfig} */
module.exports = withPWA({
    reactStrictMode: true,
    pwa: {
        dest: "public",
        register: true,
        disable: process.env.NODE_ENV ? false : true
    }
});
