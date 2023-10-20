import "../../../../globals.scss";
import { ReactNode } from "react";
import { NextAuthProvider, TrpcProvider } from "providers";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";
import deepmerge from "deepmerge";
import { Meta } from "components/meta";
import { IndexStatus } from "components/index-status";
// import { AgGridProvider } from "components/ag-grid-provider";

const IndexPageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Meta />
            <div className="h-full relative">
                <div className="will-change-transform h-full w-full flex">
                    <div className="flex flex-grow overflow-y-hidden shadow-md">
                        <main className="flex flex-col items-center grow h-full overflow-y-auto">
                            <IndexStatus />
                            <div className="w-full flex flex-col flex-grow">
                                {/* <AgGridProvider>{children}</AgGridProvider> */}
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default async function PanelLayout(props: { children: ReactNode; params: { locale: string } }) {
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
                            <IndexPageLayout>{props.children}</IndexPageLayout>
                        </NextIntlClientProvider>
                    </NextAuthProvider>
                </TrpcProvider>
            </body>
        </html>
    );
}
