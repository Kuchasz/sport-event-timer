"use client";

import { trpc } from "trpc-core";
import { useCurrentRaceId } from "hooks";
import { useTranslations } from "next-intl";
import { PageHeader } from "components/page-header";
import { mdiOpenInNew, mdiPlaylistPlay, mdiQrcode, mdiTimer10, mdiTimerOutline } from "@mdi/js";
import Icon from "@mdi/react";
import Link from "next/link";
import { Button } from "components/button";
import type { Route } from "next";
import QR from "qrcode";
import { sanitizeFileName, triggerBase64Download } from "@set/utils/dist/file";
import { buildApplicationPath } from "utils";

type ApplicationCardProps = {
    href: Route;
    qrFileName: string;
    name: string;
    description: string;
    icon: string;
};

const ApplicationCard = ({ href, qrFileName, name, description, icon }: ApplicationCardProps) => {
    const t = useTranslations();

    const generateQRCode = async () => {
        const qr = await QR.toDataURL(href, { width: 800, margin: 2 });
        triggerBase64Download(qr, qrFileName);
    };

    return (
        <div className="my-5 flex">
            <Link
                href={href}
                target="_blank"
                className="mx-5 flex h-32 w-48 shrink-0 flex-col items-center self-start overflow-clip rounded-md border border-gray-100 p-4 shadow-sm"
            >
                <Icon path={icon} size={3} />
                <span>{name}</span>
            </Link>
            <div className="flex max-w-xl flex-col justify-between">
                <div className="text-sm">{description}</div>
                <div className="flex justify-end gap-2">
                    <Button onClick={generateQRCode}>
                        <Icon path={mdiQrcode} size={0.8} />
                        <span className="ml-2">{t("pages.timers.applications.buttons.getQrCode")}</span>
                    </Button>
                    <Button outline>
                        <Icon size={0.8} path={mdiOpenInNew} />
                        <span className="ml-2">{t("pages.timers.applications.buttons.open")}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

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
                                <ApplicationCard
                                    href={buildApplicationPath(`/timer/${raceId}`) as Route}
                                    qrFileName={`qr-countdown-${sanitizeFileName(race.name)}.png`}
                                    name={t("pages.timers.applications.countdown.title")}
                                    description={t("pages.timers.applications.countdown.description")}
                                    icon={mdiTimer10}
                                />
                                <ApplicationCard
                                    href={buildApplicationPath(`/timer/${raceId}/t`) as Route}
                                    qrFileName={`qr-start-list-${sanitizeFileName(race.name)}.png`}
                                    name={t("pages.timers.applications.startList.title")}
                                    description={t("pages.timers.applications.startList.description")}
                                    icon={mdiPlaylistPlay}
                                />
                                <ApplicationCard
                                    href={buildApplicationPath(`/timer/${raceId}/t`) as Route}
                                    qrFileName={`qr-stopwatch-${sanitizeFileName(race.name)}.png`}
                                    name={t("pages.timers.applications.stopwatch.title")}
                                    description={t("pages.timers.applications.stopwatch.description")}
                                    icon={mdiTimerOutline}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
