import { locales, type Locales } from "src/i18n/locales";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { TrpcProvider } from "src/providers";
import "../../../globals.scss";
import { getLocales } from "src/i18n";

export default async function RegistrationLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
    const isValidLocale = locales.includes(params.locale as Locales);
    if (!isValidLocale) notFound();

    const { locale } = params;

    let messages;

    try {
        messages = await getLocales(locale);
    } catch (error) {
        notFound();
    }

    return (
        <html className="h-full w-full" lang={locale}>
            <body className="flex h-full w-full flex-col justify-center text-zinc-900">
                <NextIntlClientProvider timeZone="Europe/Warsaw" locale={locale} messages={messages}>
                    <TrpcProvider toastConfirmations={false} enableSubscriptions={false}>
                        {children}
                    </TrpcProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
