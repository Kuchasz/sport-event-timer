import { mdiEmailOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { getCurrentYear } from "@set/utils/dist/datetime";
import deepmerge from "deepmerge";
import { locales, type Locales } from "i18n";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { TrpcProvider } from "providers";
import { env } from "../../../env";
import "../../../globals.scss";
import RegistrationStateProvider from "./registration-state-provider";

export const metadata = {
    title: "Login",
    description: "Login to use the application",
};

export default async function Layout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
    const isValidLocale = locales.includes(params.locale as Locales);
    if (!isValidLocale) notFound();

    const { locale } = params;

    let messages;

    try {
        const localeMessages = (await import(`../../../i18n/resources/${locale}.json`)).default;
        const defaultMessages = (await import(`../../../i18n/resources/en.json`)).default;

        messages = deepmerge(defaultMessages, localeMessages) as any;
    } catch (error) {
        notFound();
    }

    return (
        <html className="h-full w-full" lang={locale}>
            <body className="flex h-full w-full flex-col">
                <RegistrationStateProvider value={env.USER_REGISTRATION_ENABLED}>
                    <NextIntlClientProvider timeZone="Europe/Warsaw" locale={locale} messages={messages}>
                        <TrpcProvider toastConfirmations={false} enableSubscriptions={false}>
                            <div className="grid h-full w-full grid-cols-2">
                                <section className="flex h-full flex-col items-center justify-center">
                                    <div className="flex w-full max-w-sm flex-grow flex-col items-center justify-center">{children}</div>
                                    <div className="mb-4 flex w-full items-center justify-between px-4 text-xs text-gray-500">
                                        <span>
                                            © {getCurrentYear()} {messages.auth.rights}
                                        </span>
                                        <span className="flex items-center">
                                            <Icon path={mdiEmailOutline} size={0.6} />
                                            <span className="ml-1">help@example.com</span>
                                        </span>
                                    </div>
                                </section>
                                <section className="p-2">
                                    <div className="relative flex h-full items-end justify-end overflow-hidden rounded-xl bg-blue-900">
                                        <img
                                            className="absolute top-0 h-full w-full object-cover"
                                            src="https://ps-wed.azurewebsites.net/rura/meta-2023/big/PF7B9152.jpg"></img>
                                        <div className="absolute top-0 h-full w-full bg-gradient-to-t from-black to-transparent"></div>
                                        <div className="relative">
                                            <img className="m-4" src="/assets/logo_ravelo.png" />
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </TrpcProvider>
                    </NextIntlClientProvider>
                </RegistrationStateProvider>
            </body>
        </html>
    );
}
