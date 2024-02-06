import type { Metadata } from "next";
import type { ReactNode } from "react";
import React from "react";
import { StopwatchLayout } from "./stopwatch-layout";
import { authenticate, getServerSession } from "auth";
import { notFound } from "next/navigation";
import deepmerge from "deepmerge";
import { type Locales, locales } from "i18n/locales";
import { NextIntlClientProvider } from "next-intl";
import { Task } from "@set/utils/dist/task";
import { trpcRSC } from "trpc-core-rsc";
import { SessionProvider } from "auth/provider";
import { TrpcProvider } from "providers";

export default async function ({
    children,
    params,
    title,
}: {
    children: ReactNode;
    params: { locale: string; raceId: string };
    title: ReactNode;
}) {
    await authenticate();
    const isValidLocale = locales.includes(params.locale as Locales);
    const session = await getServerSession();
    if (!isValidLocale) notFound();

    const race = await Task.tryCatch(trpcRSC.race.race.query({ raceId: Number(params.raceId) }));
    if (race.type !== "success") notFound();

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
                    <SessionProvider session={session!}>
                        <TrpcProvider toastConfirmations={false} enableSubscriptions={true}>
                            <StopwatchLayout title={title}>{children}</StopwatchLayout>
                        </TrpcProvider>
                    </SessionProvider>
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
