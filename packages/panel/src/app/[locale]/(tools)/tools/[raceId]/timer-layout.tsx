"use client";
import { TrpcProvider } from "src/providers";
import "../../../../../globals.scss";

export default function TimerLayout({ children }: { children: React.ReactNode }) {
    return (
        <TrpcProvider toastConfirmations={false} enableSubscriptions={false}>
            {children}
        </TrpcProvider>
    );
}
