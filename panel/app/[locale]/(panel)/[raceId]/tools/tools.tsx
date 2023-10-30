"use client";

import { trpc } from "trpc-core";
import { useCurrentRaceId } from "hooks";
import { useTranslations } from "next-intl";
import { PageHeader } from "components/page-header";
import { mdiFlagCheckered, mdiOpenInNew, mdiPlaylistPlay, mdiQrcode, mdiTimer10, mdiTimerOutline } from "@mdi/js";
import Icon from "@mdi/react";
import Link from "next/link";
import { Button } from "components/button";
import type { Route } from "next";
import QR from "qrcode";
import { sanitizeFileName, triggerBase64Download } from "@set/utils/dist/file";
import { buildApplicationPath } from "utils";
import { useRouter } from "next/navigation";

type ApplicationCardProps = {
    href: Route;
    qrFileName: string;
    name: string;
    description: string;
    icon: string;
};

const ApplicationCard = ({ href, qrFileName, name, description, icon }: ApplicationCardProps) => {
    const t = useTranslations();
    const router = useRouter();

    const generateQRCode = async () => {
        const qr = await QR.toDataURL(href, { width: 800, margin: 2 });
        triggerBase64Download(qr, qrFileName);
    };

    const openApplication = () => {
        router.push(href);
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
                        <span className="ml-2">{t("pages.tools.applications.buttons.getQrCode")}</span>
                    </Button>
                    <Button onClick={openApplication} outline>
                        <Icon size={0.8} path={mdiOpenInNew} />
                        <span className="ml-2">{t("pages.tools.applications.buttons.open")}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const Tools = () => {
    const raceId = useCurrentRaceId();
    const { data: race } = trpc.race.raceRaport.useQuery({ raceId: raceId }, { enabled: !!raceId });
    const t = useTranslations();

    return (
        <>
            {race && (
                <div>
                    <div>
                        <PageHeader title={t("pages.tools.header.title")} description={t("pages.tools.header.description")} />
                        <div className="mb-4 mt-8">
                            <div className="flex flex-col">
                                <ApplicationCard
                                    href={buildApplicationPath(`/timer/${raceId}`)}
                                    qrFileName={`qr-countdown-${sanitizeFileName(race.name)}.png`}
                                    name={t("pages.tools.applications.countdown.title")}
                                    description={t("pages.tools.applications.countdown.description")}
                                    icon={mdiTimer10}
                                />
                                <ApplicationCard
                                    href={buildApplicationPath(`/timer/${raceId}/t`)}
                                    qrFileName={`qr-start-list-${sanitizeFileName(race.name)}.png`}
                                    name={t("pages.tools.applications.startList.title")}
                                    description={t("pages.tools.applications.startList.description")}
                                    icon={mdiPlaylistPlay}
                                />
                                <ApplicationCard
                                    href={buildApplicationPath(`/timer/${raceId}/t`)}
                                    qrFileName={`qr-stopwatch-${sanitizeFileName(race.name)}.png`}
                                    name={t("pages.tools.applications.stopwatch.title")}
                                    description={t("pages.tools.applications.stopwatch.description")}
                                    icon={mdiTimerOutline}
                                />
                                <ApplicationCard
                                    href={buildApplicationPath(`/results/${raceId}`)}
                                    qrFileName={`qr-results-${sanitizeFileName(race.name)}.png`}
                                    name={t("pages.tools.applications.results.title")}
                                    description={t("pages.tools.applications.results.description")}
                                    icon={mdiFlagCheckered}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
