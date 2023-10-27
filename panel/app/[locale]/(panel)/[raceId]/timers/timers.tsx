"use client";

import { trpc } from "trpc-core";
import { useCurrentRaceId } from "hooks";
import { useTranslations } from "next-intl";
import { PageHeader } from "components/page-header";

export const Timers = () => {
    const raceId = useCurrentRaceId();
    const { data: race } = trpc.race.raceRaport.useQuery({ raceId: raceId }, { enabled: !!raceId });
    const t = useTranslations();

    return (
        <>
            {race && (
                <div>
                    <div>
                        <PageHeader title={t("pages.timers.header.title")} description={t("pages.timers.header.description")} />
                        <div className="mb-4 mt-8">
                            <div className="mx-3 text-xl font-semibold">{t("pages.race.statistics.header.title")}</div>
                            <div className="flex"></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
