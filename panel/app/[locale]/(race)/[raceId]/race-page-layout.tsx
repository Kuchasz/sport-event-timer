import Link from "next/link";
import type { Route } from "next";
import { Meta } from "components/meta";
import { RaceMenu } from "components/race-menu";
import { Status } from "components/status";
import { trpcRSC } from "trpc-core-rsc";
import { ConciseRaceIcon } from "components/race-icon";
import { Toaster } from "components/toaster";
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
            <div className="relative h-full">
                <div className="flex h-full w-full will-change-transform">
                    <div className="flex flex-grow overflow-y-hidden shadow-md">
                        <nav className="z-10 flex h-full w-60 shrink-0 flex-col overflow-hidden shadow-lg">
                            <Link href={"/" as Route}>
                                <div className="mb-6 ml-3 flex cursor-pointer flex-col items-center px-4 py-4 text-center transition-opacity">
                                    <img className="h-8" src="/assets/logo_ravelo_black.png"></img>
                                </div>
                            </Link>
                            <ConciseRaceIcon r={race.result} />
                            <RaceMenu raceId={raceId} totalPlayers={totalPlayers} totalRegistrations={totalRegistrations} />
                        </nav>
                        <main className="flex h-full grow flex-col overflow-y-auto">
                            <Status breadcrumbs={breadcrumbs} />
                            <div className="flex-grow overflow-y-scroll px-8 py-4">{children}</div>
                            <Toaster />
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};