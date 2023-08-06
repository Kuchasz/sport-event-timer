import "../../globals.scss";
import PageLayout from "../../components/page-layout";
import { ReactNode } from "react";
import { NextAuthProvider, TrpcProvider } from "providers";

export default async function PanelLayout(props: { children: ReactNode; breadcrumbs: ReactNode }) {
    return (
        <html className="w-full h-full" lang="en">
            <body className="w-full h-full flex flex-col text-zinc-900">
                <TrpcProvider>
                    <NextAuthProvider>
                        <PageLayout breadcrumbs={props.breadcrumbs}>{props.children}</PageLayout>
                    </NextAuthProvider>
                </TrpcProvider>
            </body>
        </html>
    );
}
