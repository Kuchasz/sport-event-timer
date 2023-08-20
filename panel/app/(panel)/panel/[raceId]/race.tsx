"use client";

import { DashboardCard } from "components/dashboard-card";
import { trpc } from "trpc-core";
import { useCurrentRaceId } from "hooks";

export const Race = () => {
    const raceId = useCurrentRaceId();
    const { data: race } = trpc.race.raceRaport.useQuery({ raceId: raceId! }, { enabled: !!raceId });

    return (
        <>
            {race && (
                <div>
                    <div>
                        <h1 className="text-3xl">{race.name}</h1>
                        <h2>{race.date.toLocaleDateString()}</h2>

                        <div className="mt-8 mb-4">
                            <div className="mx-3 text-xl font-semibold">Statistics</div>
                            <div className="flex">
                                <DashboardCard.Range min={race.players} max={race.playersLimit} title="Players limit" />
                                <DashboardCard.Discrete enabled={race.registrationEnabled} title="Registration status" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
