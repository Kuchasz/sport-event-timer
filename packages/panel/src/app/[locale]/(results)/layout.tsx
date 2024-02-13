import { locales, type Locales } from "src/i18n/locales";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { TrpcProvider } from "src/providers";
import type { ReactNode } from "react";
import "../../../globals.scss";
import { getLocales } from "src/i18n";

export default async function ResultLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
    const isValidLocale = locales.includes(params.locale as Locales);
    if (!isValidLocale) notFound();

    const { locale } = params;

    let messages;

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { results } = await getLocales(locale);
        messages = { results };
    } catch (error) {
        notFound();
    }

    return (
        <html className="h-full w-full">
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
