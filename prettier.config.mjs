/**
 * @type {import('prettier').Config}
 */
const config = {
    tabWidth: 4,
    useTabs: false,
    printWidth: 140,
    arrowParens: "avoid",
    bracketSameLine: true,
    plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
