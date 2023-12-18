"use client";

import { DashboardCard } from "components/dashboard-card";
import { trpc } from "trpc-core";
import { useCurrentRaceId } from "hooks";
import { useTranslations } from "next-intl";
import { PageHeader } from "components/page-header";

export const BasicInfo = () => {
    const raceId = useCurrentRaceId();
    const { data: race } = trpc.race.raceRaport.useQuery({ raceId: raceId }, { enabled: !!raceId });
    const t = useTranslations();

    return (
        <>
            {race && (
                <div>
                    <div>
                        <PageHeader title={t("pages.basicInfo.header.title")} description={t("pages.basicInfo.header.description")} />
                        <div className="mb-4 mt-8">
                            <div className="mx-3 text-xl font-semibold">{t("pages.basicInfo.statistics.header.title")}</div>
                            <div className="flex">
                                <DashboardCard.Range
                                    min={race.registeredPlayers}
                                    max={race.playersLimit}
                                    title={t("pages.basicInfo.statistics.widgets.registeredPlayers")}
                                />
                                <DashboardCard.Discrete
                                    enabled={race.registrationEnabled}
                                    title={t("pages.basicInfo.statistics.widgets.registrationStatus")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
