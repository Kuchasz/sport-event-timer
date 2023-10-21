import "../../../globals.scss";
import type { ReactNode } from "react";
import { TrpcProvider } from "providers";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";
import deepmerge from "deepmerge";

export default async function RegistrationLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
    const locale = useLocale();

    if (params.locale !== locale) {
        notFound();
    }

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
            <body className="flex h-full w-full flex-col justify-center text-zinc-900">
                <NextIntlClientProvider timeZone="Europe/Warsaw" locale={locale} messages={messages}>
                    <TrpcProvider>{children}</TrpcProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
