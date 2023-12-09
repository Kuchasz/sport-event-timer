import deepmerge from "deepmerge";
import { locales, type Locales } from "i18n";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { TrpcProvider } from "providers";
import type { ReactNode } from "react";
import "../../../../globals.scss";
import { RacePageLayout } from "./race-page-layout";
import { SessionProvider } from "../../../../auth/provider";
import { authenticate, getServerSession } from "../../../../auth";

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
        const localeMessages = (await import(`../../../../i18n/resources/${locale}.json`)).default;
        const defaultMessages = (await import(`../../../../i18n/resources/en.json`)).default;

        messages = deepmerge(defaultMessages, localeMessages) as any;
    } catch (error) {
        notFound();
    }

    return (
        <html className="h-full w-full" lang={locale}>
            <body className="flex h-full w-full flex-col text-zinc-900">
                <NextIntlClientProvider timeZone="Europe/Warsaw" locale={locale} messages={messages}>
                    <TrpcProvider enableSubscriptions={false}>
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
