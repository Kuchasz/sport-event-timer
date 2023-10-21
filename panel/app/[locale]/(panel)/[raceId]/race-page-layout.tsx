import Link from "next/link";
import type { Route } from "next";
import { Meta } from "components/meta";
import { RaceMenu } from "components/race-menu";
import { Status } from "components/status";
import { AgGridProvider } from "components/ag-grid-provider";

type Props = {
    raceId: string;
    breadcrumbs: React.ReactNode;
    children: React.ReactNode;
};

export const RacePageLayout = ({ raceId, breadcrumbs, children }: Props) => {
    return (
        <>
            <Meta />
            <div className="relative h-full">
                <div className="flex h-full w-full will-change-transform">
                    <div className="flex flex-grow overflow-y-hidden shadow-md">
                        <nav className="z-10 w-60 shrink-0 flex-col overflow-clip  shadow-lg">
                            <Link href={"/" as Route}>
                                <div className="my-6 ml-3 flex cursor-pointer flex-col items-start px-4 py-4 text-center transition-opacity">
                                    <img src="/assets/logo_ravelo_black.png"></img>
                                </div>
                            </Link>
                            <RaceMenu raceId={raceId} />
                        </nav>
                        <main className="flex h-full grow flex-col overflow-y-auto">
                            <Status breadcrumbs={breadcrumbs} />
                            <div className="flex-grow overflow-y-scroll px-8 py-4">
                                <AgGridProvider>{children}</AgGridProvider>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};
