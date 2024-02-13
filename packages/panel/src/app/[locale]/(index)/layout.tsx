import { getServerSession } from "src/auth";
import { SessionProvider } from "src/auth/provider";
import { Toaster } from "src/components/toaster";
import { locales, type Locales } from "src/i18n/locales";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { TrpcProvider } from "src/providers";
import type { ReactNode } from "react";
import { Status } from "../../../components/index/status";
import { Meta } from "../../../components/meta";
import "../../../globals.scss";
import { getLocales } from "src/i18n";

const IndexPageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Meta />
            <div className="relative h-full">
                <div className="flex h-full w-full will-change-transform">
                    <div className="flex flex-grow overflow-y-hidden shadow-md">
                        <main className="flex h-full grow flex-col items-center overflow-y-auto">
                            <Status />
                            <div className="flex w-full flex-grow flex-col">{children}</div>
                            <Toaster />
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default async function PanelLayout(props: { children: ReactNode; params: { locale: string } }) {
    const isValidLocale = locales.includes(props.params.locale as Locales);
    const session = await getServerSession();
    if (!isValidLocale) notFound();

    const {
        params: { locale },
    } = props;

    let messages;

    try {
        messages = messages = await getLocales(locale);
    } catch (error) {
        notFound();
    }

    return (
        <html className="h-full w-full" lang={locale}>
            <body className="flex h-full w-full flex-col text-zinc-900">
                <NextIntlClientProvider timeZone="Europe/Warsaw" locale={locale} messages={messages}>
                    <TrpcProvider toastConfirmations={true} enableSubscriptions={false}>
                        <SessionProvider session={session!}>
                            <IndexPageLayout>{props.children}</IndexPageLayout>
                        </SessionProvider>
                    </TrpcProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
