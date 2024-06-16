import Link from "next/link";
import type { Route } from "next";
import { Meta } from "src/components/meta";
import { RaceMenu } from "src/components/race-menu";
import { Status } from "src/components/status";
import { trpcRSC } from "src/trpc-core-rsc";
import { ConciseRaceIcon } from "src/components/race-icon";
import { Toaster } from "src/components/toaster";
import { notFound } from "next/navigation";
import { Task } from "@set/utils/dist/task";

type Props = {
    raceId: string;
    breadcrumbs: React.ReactNode;
    children: React.ReactNode;
};

export const RacePageLayout = async ({ raceId, breadcrumbs, children }: Props) => {
    const race = await Task.tryCatch(trpcRSC.race.race.query({ raceId: Number(raceId) }));

    if (race.type !== "success") notFound();

    const totalPlayers = await trpcRSC.player.totalPlayers.query({ raceId: Number(raceId) });
    const totalRegistrations = await trpcRSC.playerRegistration.totalRegistrations.query({ raceId: Number(raceId) });

    return (
        <>
            <Meta />
            <div className="relative h-full overflow-hidden">
                <div className="flex h-full w-full will-change-transform">
                    <div className="flex flex-grow overflow-y-hidden shadow-md">
                        <nav className="z-20 flex h-full w-64 shrink-0 flex-col overflow-hidden shadow-lg">
                            <Link href={"/" as Route}>
                                <div className="mb-6 ml-3 flex cursor-pointer flex-col items-center px-4 py-4 text-center transition-opacity">
                                    <img className="h-8" src="/assets/logo_ravelo_black.png"></img>
                                </div>
                            </Link>
                            <ConciseRaceIcon r={race.result} />
                            <RaceMenu raceId={raceId} totalPlayers={totalPlayers} totalRegistrations={totalRegistrations} />
                        </nav>

                        <main className="flex h-full grow flex-col overflow-hidden">
                            <Status breadcrumbs={breadcrumbs} />
                            {/* <div className="flex flex-grow bg-gray-50">
                                <div className="flex-grow overflow-y-scroll px-12 py-12">{children}</div>
                            </div> */}

                            {children}
                            <Toaster />
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};
