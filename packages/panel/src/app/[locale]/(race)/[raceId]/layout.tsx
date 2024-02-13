import { locales, type Locales } from "src/i18n/locales";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { TrpcProvider } from "src/providers";
import type { ReactNode } from "react";
import { authenticate, getServerSession } from "../../../../auth";
import { SessionProvider } from "../../../../auth/provider";
import "../../../../globals.scss";
import { RacePageLayout } from "./race-page-layout";
import { getLocales } from "src/i18n";

export default async function PanelLayout(props: {
    children: ReactNode;
    breadcrumbs: ReactNode;
    params: { locale: string; raceId: string };
}) {
    await authenticate();
    const isValidLocale = locales.includes(props?.params?.locale as Locales);
    if (!isValidLocale) notFound();

    const session = await getServerSession();

    const {
        params: { locale },
    } = props;

    let messages;

    try {
        messages = await getLocales(locale);
    } catch (error) {
        notFound();
    }

    return (
        <html className="h-full w-full" lang={locale}>
            <body className="flex h-full w-full flex-col text-zinc-900">
                <NextIntlClientProvider timeZone="Europe/Warsaw" locale={locale} messages={messages}>
                    <TrpcProvider toastConfirmations={true} enableSubscriptions={false}>
                        <SessionProvider session={session!}>
                            <RacePageLayout raceId={props.params.raceId} breadcrumbs={props.breadcrumbs}>
                                {props.children}
                            </RacePageLayout>
                        </SessionProvider>
                    </TrpcProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}