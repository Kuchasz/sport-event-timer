import { locales, type Locales } from "i18n/locales";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { TrpcProvider } from "providers";
import type { ReactNode } from "react";
import "../../../globals.scss";

export default async function ResultLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
    const isValidLocale = locales.includes(params.locale as Locales);
    if (!isValidLocale) notFound();

    const { locale } = params;

    let messages;

    try {
        messages = (await import(`../../../i18n/resources/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <html className="h-full w-full" lang={locale}>
            <body className="flex h-full w-full flex-col text-zinc-900">
                <NextIntlClientProvider timeZone="Europe/Warsaw" locale={locale} messages={messages}>
                    <TrpcProvider toastConfirmations={false} enableSubscriptions={false}>
                        {children}
                    </TrpcProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
