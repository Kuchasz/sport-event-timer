"use client";
import { TrpcProvider } from "providers";
import type { ReactNode } from "react";
import "../../../../../globals.scss";

export default function TimerLayout({ children }: { children: ReactNode }) {
    return <TrpcProvider enableSubscriptions={false}>{children}</TrpcProvider>;
}
