"use client";
import { TrpcProvider } from "src/providers";
import type { ReactNode } from "react";
import "../../../../../globals.scss";

export default function TimerLayout({ children }: { children: ReactNode }) {
    return (
        <TrpcProvider toastConfirmations={false} enableSubscriptions={false}>
            {children}
        </TrpcProvider>
    );
}
