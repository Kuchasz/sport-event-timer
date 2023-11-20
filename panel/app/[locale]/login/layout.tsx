import deepmerge from "deepmerge";
import { type Locales, locales } from "i18n";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import "../../../globals.scss";
import { TrpcProvider } from "providers";

export const metadata = {
    title: "Login",
    description: "Login to use the application",
};

export default async function Layout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
    const isValidLocale = locales.includes(params.locale as Locales);
    if (!isValidLocale) notFound();

    const { locale } = params;

    let messages;

    try {
        const localeMessages = (await import(`../../../i18n/resources/${locale}.json`)).default;
        const defaultMessages = (await import(`../../../i18n/resources/en.json`)).default;

        messages = deepmerge(defaultMessages, localeMessages) as any;
    } catch (error) {
        notFound();
    }

    return (
        <html className="h-full w-full" lang={locale}>
            <body className="flex h-full w-full flex-col">
                <NextIntlClientProvider timeZone="Europe/Warsaw" locale={locale} messages={messages}>
                    <TrpcProvider>{children}</TrpcProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
