"use client";

import { DashboardCard } from "components/dashboard-card";
import { trpc } from "trpc-core";
import { useCurrentRaceId } from "hooks";
import { useTranslations, useLocale } from "next-intl";
import { PageHeader } from "components/page-header";

export const Race = () => {
    const raceId = useCurrentRaceId();
    const { data: race } = trpc.race.raceRaport.useQuery({ raceId: raceId }, { enabled: !!raceId });
    const t = useTranslations();
    const locale = useLocale();

    return (
        <>
            {race && (
                <div>
                    <div>
                        <PageHeader title={race.name} description={race.date.toLocaleDateString(locale)} />
                        <div className="mb-4 mt-8">
                            <div className="mx-3 text-xl font-semibold">{t("pages.race.statistics.header.title")}</div>
                            <div className="flex">
                                <DashboardCard.Range
                                    min={race.registeredPlayers}
                                    max={race.playersLimit}
                                    title={t("pages.race.statistics.widgets.registeredPlayers")}
                                />
                                <DashboardCard.Discrete
                                    enabled={race.registrationEnabled}
                                    title={t("pages.race.statistics.widgets.registrationStatus")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
