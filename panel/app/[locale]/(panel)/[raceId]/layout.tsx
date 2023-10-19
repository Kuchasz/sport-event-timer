import "../../../../globals.scss";
import { ReactNode } from "react";
import { NextAuthProvider, TrpcProvider } from "providers";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";
import deepmerge from "deepmerge";

import Link from "next/link";
import { Route } from "next";
import { Meta } from "components/meta";
import { RaceMenu } from "components/race-menu";
import { Status } from "components/status";
import { AgGridProvider } from "components/ag-grid-provider";

type Props = {
    raceId: string;
    breadcrumbs: React.ReactNode;
    children: React.ReactNode;
};

const RacePageLayout = ({ raceId, breadcrumbs, children }: Props) => {
    return (
        <>
            <Meta />
            <div className="h-full relative">
                <div className="will-change-transform h-full w-full flex">
                    <div className="flex flex-grow overflow-y-hidden shadow-md">
                        <nav className="w-60 shrink-0 overflow-clip flex-col shadow-lg  z-10">
                            <Link href={"/" as Route}>
                                <div className="transition-opacity flex flex-col ml-3 my-6 items-start cursor-pointer text-center px-4 py-4">
                                    <img src="/assets/logo_ravelo_black.png"></img>
                                </div>
                            </Link>
                            <RaceMenu raceId={raceId} />
                        </nav>
                        <main className="flex flex-col grow h-full overflow-y-auto">
                            <Status breadcrumbs={breadcrumbs} />
                            <div className="px-8 py-4 flex-grow overflow-y-scroll">
                                <AgGridProvider>{children}</AgGridProvider>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

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
        <html className="w-full h-full" lang={locale}>
            <body className="w-full h-full flex flex-col text-zinc-900">
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
