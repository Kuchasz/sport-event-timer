"use client";

import { trpc } from "trpc-core";
import { useCurrentRaceId } from "hooks";
import { useTranslations } from "next-intl";
import { PageHeader } from "components/page-header";
import { mdiPlaylistPlay, mdiTimer10, mdiTimerOutline } from "@mdi/js";
import Icon from "@mdi/react";
import Link from "next/link";

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
                            <div className="flex flex-col">
                                <div className="my-3 flex">
                                    <Link
                                        href={`/timer/${raceId}`}
                                        target="_blank"
                                        className="mx-3 flex h-32 w-48 flex-col items-center self-start overflow-clip rounded-md border border-gray-100 p-4 shadow-sm"
                                    >
                                        <Icon path={mdiTimer10} size={3} />
                                        <span>Odliczanie (do zera)</span>
                                    </Link>
                                    <span>Some meaningful description that will highlight some use cases</span>
                                </div>
                                <div className="my-3 flex">
                                    <Link
                                        href={`/timer/${raceId}/t`}
                                        target="_blank"
                                        className="mx-3 flex h-32 w-48 flex-col items-center self-start overflow-clip rounded-md border border-gray-100 p-4 shadow-sm"
                                    >
                                        <Icon path={mdiPlaylistPlay} size={3} />
                                        <span>Lista startowa</span>
                                    </Link>
                                    <span>Some meaningful description that will highlight some use cases</span>
                                </div>
                                <div className="my-3 flex">
                                    <Link
                                        href={`/timer/${raceId}`}
                                        target="_blank"
                                        className="mx-3 flex h-32 w-48 flex-col items-center self-start overflow-clip rounded-md border border-gray-100 p-4 shadow-sm"
                                    >
                                        <Icon path={mdiTimerOutline} size={3} />
                                        <span>Stoper (do zera)</span>
                                    </Link>
                                    <span>Some meaningful description that will highlight some use cases</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
