"use client";
import { TrpcProvider } from "providers";
import { ReactNode } from "react";
import "../../../../../globals.scss";

export default function TimerLayout({ children }: { children: ReactNode }) {
    return <TrpcProvider>{children}</TrpcProvider>;
}
