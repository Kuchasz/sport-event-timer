import "../../../globals.scss";
import { ReactNode } from "react";
import { TrpcProvider } from "providers";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";

export default async function RegistrationLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
    const locale = useLocale();

    if (params.locale !== locale) {
        notFound();
    }

    let messages;

    try {
        messages = (await import(`../../../i18n/resources/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <html className="w-full h-full" lang="en">
            <body className="w-full h-full flex flex-col justify-center text-zinc-900">
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <TrpcProvider>{children}</TrpcProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
