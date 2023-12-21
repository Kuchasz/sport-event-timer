"use client";

import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { PageHeader } from "components/page-header";
import { TimingPointCreate } from "components/panel/timing-point/timing-point-create";
import { PoorModal } from "components/poor-modal";
import { useTranslations } from "next-intl";
import Head from "next/head";
import Link from "next/link";
import { type Route } from "next";
import type { AppRouterOutputs } from "trpc";
import { getTimingPointIcon } from "utils";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoint"];
// type AccessKeys = AppRouterOutputs["timingPoint"]["timingPointAccessUrls"];

const TimingPointCard = ({
    onCreate,
    index,
    raceId,
    timingPoint,
    isFirst,
    isLast,
}: {
    onCreate: () => void;
    index: number;
    raceId: number;
    isFirst: boolean;
    isLast: boolean;
    timingPoint: TimingPoint;
}) => {
    const t = useTranslations();

    return (
        <div className="flex flex-col">
            {!isFirst && (
                <div className="flex flex-col items-center">
                    <PoorModal
                        onResolve={onCreate}
                        title={t("pages.timingPoints.create.title")}
                        component={TimingPointCreate}
                        componentProps={{ raceId: raceId, index, onReject: () => {} }}>
                        <button className="my-1 flex w-full cursor-pointer items-center self-center rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-600">
                            <Icon path={mdiPlus} size={0.7} />
                            <span className="ml-1.5">{t("pages.timingPoints.create.button")}</span>
                        </button>
                    </PoorModal>
                </div>
            )}

            <div>
                <Link href={`/${timingPoint.raceId}/timing-points/${timingPoint.id}` as Route}>
                    <div className="my-1 w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#c2e59c] to-[#64b3f4] p-1">
                        <div className={classNames("flex rounded-lg bg-white px-6 py-4")}>
                            <div
                                className={classNames(`mr-4 self-center rounded-full bg-gray-100 p-2 text-gray-500`, {
                                    ["rotate-90"]: !isLast,
                                })}>
                                <Icon path={getTimingPointIcon(isFirst, isLast)} size={0.8} />
                            </div>
                            <div className="flex flex-col">
                                <h4 className={classNames("text-md font-bold")}>{timingPoint.name}</h4>
                                <span className={classNames("text-sm text-gray-500")}>
                                    {timingPoint.description ?? "Timing point where time should be registered"}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export const TimingPoints = () => {
    const raceId = useCurrentRaceId();
    const { data: timingPoints, refetch: refetchTimingPoints } = trpc.timingPoint.timingPoints.useQuery(
        { raceId: raceId },
        { initialData: [] },
    );
    const t = useTranslations();

    // const deleteTimingPointMutation = trpc.timingPoint.delete.useMutation();
    // const deleteTimingPointAccessKeyMutation = trpc.timingPoint.deleteTimingPointAccessUrl.useMutation();

    const { data: timingPointsOrder, refetch: refetchOrder } = trpc.timingPoint.timingPointsOrder.useQuery(
        { raceId: raceId },
        {
            initialData: [],
        },
    );

    const sortedTimingPoints = timingPointsOrder.map(point => timingPoints.find(tp => point === tp.id)!);

    // const deleteTimingPoint = async (timingPoint: TimingPoint) => {
    //     await deleteTimingPointMutation.mutateAsync(timingPoint);

    //     void refetchOrder();
    //     void refetchTimingPoints();
    // };

    // const deleteAccessKey = async (timingPointAccessKey: AccessKeys[0]) => {
    //     await deleteTimingPointAccessKeyMutation.mutateAsync({ timingPointAccessUrlId: timingPointAccessKey.id });
    // };

    return (
        <>
            <Head>
                <title>{t("pages.timingPoints.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.timingPoints.header.title")} description={t("pages.timingPoints.header.description")} />
                <div className="flex">
                    <div className="w-full max-w-md ">
                        {sortedTimingPoints?.map((e, index) => (
                            <TimingPointCard
                                key={e.id}
                                index={index}
                                raceId={raceId}
                                onCreate={() => {
                                    void refetchTimingPoints();
                                    void refetchOrder();
                                }}
                                timingPoint={e}
                                isFirst={index === 0}
                                isLast={index === sortedTimingPoints.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
