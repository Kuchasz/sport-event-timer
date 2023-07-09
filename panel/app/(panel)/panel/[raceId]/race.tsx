"use client";

import { DashboardCard } from "components/dashboard-card";
import { trpc } from "trpc-core";
import { useCurrentRaceId } from "hooks";

export const Race = () => {
    const raceId = useCurrentRaceId();
    const { data: race } = trpc.race.race.useQuery({ raceId: raceId! }, { enabled: !!raceId });

    return (
        <>
            {race && (
                <div>
                    <div>
                        <h1 className="text-3xl">{race.name}</h1>
                        <h2>{race.date.toLocaleDateString()}</h2>
                        <div className="mt-8">
                            <DashboardCard title="Players limit">
                                <div className="text-5xl my-2 font-semibold">{race.playersLimit}</div>
                            </DashboardCard>
                            <DashboardCard title="Registration status">
                                <div className="text-5xl my-2 font-semibold">{race.registrationEnabled ? "enabled" : "disbled"}</div>
                            </DashboardCard>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};