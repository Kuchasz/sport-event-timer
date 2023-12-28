import type { Metadata } from "next";
import type { ReactNode } from "react";
import React from "react";
import { StopwatchLayout } from "./stopwatch-layout";
import { authenticate, getServerSession } from "auth";
import { notFound } from "next/navigation";
import deepmerge from "deepmerge";
import { type Locales, locales } from "i18n";
import { NextIntlClientProvider } from "next-intl";

export default async function ({ children, params }: { children: ReactNode; params: { locale: string } }) {
    await authenticate();
    const isValidLocale = locales.includes(params.locale as Locales);
    const session = await getServerSession();
    if (!isValidLocale) notFound();

    const { locale } = params;

    let messages;

    try {
        const localeMessages = (await import(`../../../../../i18n/resources/${locale}.json`)).default;
        const defaultMessages = (await import(`../../../../../i18n/resources/en.json`)).default;

        messages = deepmerge(defaultMessages, localeMessages) as any;
    } catch (error) {
        notFound();
    }

    return (
        <html className="h-full w-full" lang="en">
            <body className="flex h-full w-full flex-col text-zinc-900">
                <NextIntlClientProvider timeZone="Europe/Warsaw" locale={locale} messages={messages}>
                    <StopwatchLayout session={session!}>{children}</StopwatchLayout>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export function generateMetadata({ params }: { params: { locale: string; raceId: number } }): Metadata {
    return {
        title: "Stopwatch",
        manifest: `/api/manifest/${params.raceId}/stopwatch`,
    };
}
