"use client";
import { DashboardCard } from "components/dashboard-card";
import { trpc } from "trpc-core";

export function Dashboard() {
    const { data: dashboardData } = trpc.race.raport.useQuery();

    return (
        <div className="flex flex-col">
            {dashboardData && (
                <>
                    <div className="mt-8 mb-4">
                        <div className="mx-3 text-xl font-semibold">Statistics</div>
                        <div className="flex">
                            <DashboardCard.Range title="Future races" min={dashboardData.futureRaces} max={dashboardData.totalRaces} />
                            <DashboardCard.Range title="Past races" min={dashboardData.pastRaces} max={dashboardData.totalRaces} />
                        </div>
                    </div>

                    {dashboardData.nextRace ? (
                        <div className="mt-8 mb-4">
                            <div className="mx-3 text-xl font-semibold">Incoming race statistics</div>
                            <div className="flex">
                                <DashboardCard.Info title="date" text={dashboardData.nextRace.date?.toLocaleDateString()!} />
                                <DashboardCard.Info title="Name" text={dashboardData.nextRace.name!} />
                                <DashboardCard.Range
                                    title="Registered Players"
                                    min={dashboardData.nextRace.players!}
                                    max={dashboardData.nextRace.playersLimit!}
                                />
                                <DashboardCard.Discrete title="Registration status" enabled={dashboardData.nextRace.registrationEnabled!} />
                            </div>
                        </div>
                    ) : (
                        <DashboardCard.Info title="Next race" text="No next race" />
                    )}
                </>
            )}
        </div>
    );
}
