import "../../../../globals.scss";
import type { ReactNode } from "react";
import { Meta } from "components/meta";
import { IndexStatus } from "components/index-status";
import { AgGridProvider } from "components/ag-grid-provider";

export const IndexPageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Meta />
            <div className="relative h-full">
                <div className="flex h-full w-full will-change-transform">
                    <div className="flex flex-grow overflow-y-hidden shadow-md">
                        <main className="flex h-full grow flex-col items-center overflow-y-auto">
                            <IndexStatus />
                            <div className="flex w-full flex-grow flex-col">
                                <AgGridProvider>{children}</AgGridProvider>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};
