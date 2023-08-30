import "../../../globals.scss";
import { ReactNode } from "react";
import { TrpcProvider } from "providers";

export default function RegistrationLayout({ children }: { children: ReactNode }) {
    return (
        <html className="w-full h-full" lang="en">
            <body className="w-full h-full flex flex-col text-zinc-900">
                <TrpcProvider>{children}</TrpcProvider>
            </body>
        </html>
    );
}
