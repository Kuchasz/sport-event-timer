"use client";
import { DashboardCard } from "components/dashboard-card";
import { PageHeader } from "components/page-header";
import { useTranslations } from "i18n";
import { trpc } from "trpc-core";

export function Dashboard() {
    const { data: dashboardData } = trpc.race.raport.useQuery();
    const t = useTranslations();

    return (
        <div className="flex flex-col">
            <PageHeader title={t.pages.general.dashboard.header.title} description={t.pages.general.dashboard.header.description} />
            {dashboardData && (
                <>
                    <div className="mt-8 mb-4">
                        <div className="mx-3 text-xl font-semibold">{t.pages.general.dashboard.statistics.title}</div>
                        <div className="flex">
                            <DashboardCard.Range
                                title={t.pages.general.dashboard.statistics.widgets.futureRaces}
                                min={dashboardData.futureRaces}
                                max={dashboardData.totalRaces}
                            />
                            <DashboardCard.Range
                                title={t.pages.general.dashboard.statistics.widgets.pastRaces}
                                min={dashboardData.pastRaces}
                                max={dashboardData.totalRaces}
                            />
                        </div>
                    </div>

                    {dashboardData.nextRace && (
                        <div className="mt-8 mb-4">
                            <div className="mx-3 text-xl font-semibold">{t.pages.general.dashboard.raceStatistics.title}</div>
                            <div className="flex">
                                <DashboardCard.Info
                                    title={t.pages.general.dashboard.raceStatistics.widgets.date}
                                    text={dashboardData.nextRace.date?.toLocaleDateString()!}
                                />
                                <DashboardCard.Info
                                    title={t.pages.general.dashboard.raceStatistics.widgets.name}
                                    text={dashboardData.nextRace.name!}
                                />
                                <DashboardCard.Range
                                    title={t.pages.general.dashboard.raceStatistics.widgets.registeredPlayers}
                                    min={dashboardData.nextRace.registeredPlayers!}
                                    max={dashboardData.nextRace.playersLimit!}
                                />
                                <DashboardCard.Discrete
                                    title={t.pages.general.dashboard.raceStatistics.widgets.registrationStatus}
                                    enabled={dashboardData.nextRace.registrationEnabled!}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
