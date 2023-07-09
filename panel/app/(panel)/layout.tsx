import "../../globals.scss";
import PageLayout from "../../components/page-layout";
import { ReactNode } from "react";
import { NextAuthProvider, TrpcProvider } from "providers";


export default async function PanelLayout({ children }: { children: ReactNode }) {
    return (
        <html className="w-full h-full" lang="en">
            <body className="w-full h-full flex flex-col text-zinc-900">
                <TrpcProvider>
                    <NextAuthProvider>
                        <PageLayout>{children}</PageLayout>
                    </NextAuthProvider>
                </TrpcProvider>
            </body>
        </html>
    );
}
