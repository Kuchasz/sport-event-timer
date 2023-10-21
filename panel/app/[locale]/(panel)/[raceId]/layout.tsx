import "../../../../globals.scss";
import type { ReactNode } from "react";
import { NextAuthProvider, TrpcProvider } from "providers";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";
import deepmerge from "deepmerge";
import { RacePageLayout } from "./race-page-layout";

export default async function PanelLayout(props: {
    children: ReactNode;
    breadcrumbs: ReactNode;
    params: { locale: string; raceId: string };
}) {
    const locale = useLocale();

    if (props?.params?.locale !== locale) {
        notFound();
    }

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
                <TrpcProvider>
                    <NextAuthProvider>
                        <NextIntlClientProvider timeZone="Europe/Warsaw" locale={locale} messages={messages}>
                            <RacePageLayout raceId={props.params.raceId} breadcrumbs={props.breadcrumbs}>
                                {props.children}
                            </RacePageLayout>
                        </NextIntlClientProvider>
                    </NextAuthProvider>
                </TrpcProvider>
            </body>
        </html>
    );
}
