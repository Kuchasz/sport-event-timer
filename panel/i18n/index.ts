import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
    messages: (await import(`./resources/${locale}.json`)).default,
}));

export const locales = ["en", "pl"] as const;
