import "../../../../globals.scss";
import { ReactNode } from "react";
import { NextAuthProvider, TrpcProvider } from "providers";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";
import deepmerge from "deepmerge";
import { IndexPageLayout } from "components/index-page-layout";

export default async function PanelLayout(props: { children: ReactNode; breadcrumbs: ReactNode; params: { locale: string } }) {
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
                        <NextIntlClientProvider locale={locale} messages={messages}>
                            <IndexPageLayout breadcrumbs={props.breadcrumbs}>{props.children}</IndexPageLayout>
                        </NextIntlClientProvider>
                    </NextAuthProvider>
                </TrpcProvider>
            </body>
        </html>
    );
}
