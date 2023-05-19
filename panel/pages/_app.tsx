import dynamic from "next/dynamic";
import { AppType } from "next/app";
import { PanelApp } from "../apps/panel";
import { trpc } from "../connection";
import { SessionProvider } from "next-auth/react";
import { TimerApp } from "../apps/timer";
import "../globals.scss";
import type { Session } from "next-auth";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-material.css"; // Optional theme CSS
import { ResultApp } from "apps/result";
import { RegistrationApp } from "apps/registration";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CsvExportModule } from '@ag-grid-community/csv-export';


ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

const StopwatchApp = dynamic(() => import("../apps/stopwatch"), { ssr: false });

const App: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps }, router }) => {
    return router.pathname.startsWith("/panel") ? (
        <SessionProvider session={session}>
            <PanelApp Component={Component} pageProps={pageProps} router={router} />
        </SessionProvider>
    ) : router.pathname.startsWith("/stopwatch") ? (
        <SessionProvider session={session}>
            <StopwatchApp Component={Component} pageProps={pageProps} router={router} />
        </SessionProvider>
    ) : router.pathname.startsWith("/result") ? (
        <ResultApp Component={Component} pageProps={pageProps} router={router} />
    ) : router.pathname.startsWith("/registration") ? (
        <RegistrationApp Component={Component} pageProps={pageProps} router={router} />
    ) : router.pathname.startsWith("/timer") ? (
        <TimerApp Component={Component} pageProps={pageProps} router={router} />
    ) : (
        <Component {...pageProps} />
    );
};

export default trpc.withTRPC(App);
