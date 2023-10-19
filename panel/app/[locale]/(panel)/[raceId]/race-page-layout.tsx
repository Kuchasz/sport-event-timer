import Link from "next/link";
import { Route } from "next";
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
            <div className="h-full relative">
                <div className="will-change-transform h-full w-full flex">
                    <div className="flex flex-grow overflow-y-hidden shadow-md">
                        <nav className="w-60 shrink-0 overflow-clip flex-col shadow-lg  z-10">
                            <Link href={"/" as Route}>
                                <div className="transition-opacity flex flex-col ml-3 my-6 items-start cursor-pointer text-center px-4 py-4">
                                    <img src="/assets/logo_ravelo_black.png"></img>
                                </div>
                            </Link>
                            <RaceMenu raceId={raceId} />
                        </nav>
                        <main className="flex flex-col grow h-full overflow-y-auto">
                            <Status breadcrumbs={breadcrumbs} />
                            <div className="px-8 py-4 flex-grow overflow-y-scroll">
                                <AgGridProvider>{children}</AgGridProvider>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};
