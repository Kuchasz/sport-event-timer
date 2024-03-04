"use client";

import { mdiChevronRight, mdiGestureTapHold, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { createRange } from "@set/utils/dist/array";
import classNames from "classnames";
import { type Route } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import Link from "next/link";
import { PageHeader } from "src/components/page-headers";
import { TimingPointCreate } from "src/components/panel/timing-point/timing-point-create";
import { PoorModal } from "src/components/poor-modal";
import type { AppRouterOutputs } from "src/trpc";
import { getTimingPointIcon } from "src/utils";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";
import React, { useState } from "react";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoint"];

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
                <div className="my-1 flex w-full items-center rounded-3xl bg-gray-100 p-1">
                    <div className={classNames("flex rounded-lg px-6 py-4")}>
                        <div
                            className={classNames(`mr-4 self-center rounded-2xl bg-gray-300 p-3 text-white`, {
                                ["rotate-90"]: !isLast,
                            })}>
                            <Icon path={getTimingPointIcon(isFirst, isLast)} size={0.8} />
                        </div>
                        <div className="flex flex-col">
                            <h4 className={classNames("text-md font-bold")}>{timingPoint.name}</h4>
                            <span className={classNames("text-sm text-gray-400")}>
                                {timingPoint.description ?? "Timing point where time should be registered"}
                            </span>
                        </div>
                    </div>
                    <div className="flex-grow"></div>
                    <Link
                        className="mr-4 rounded-full p-1 hover:bg-white"
                        href={`/${timingPoint.raceId}/timing-points/${timingPoint.id}` as Route}>
                        <Icon path={mdiChevronRight} size={1}></Icon>
                    </Link>
                </div>
            </div>
        </div>
    );
};

type TimingPointWithLap = TimingPoint & { lap: number };

const TimingPointsOrder = ({ timesInOrder }: { timesInOrder: TimingPointWithLap[] }) => {
    const [dropTarget, setDropTarget] = useState<string>("");
    const [dragTarget, setDragTarget] = useState<string>("");

    return (
        <div>
            {timesInOrder.map(tio => (
                <React.Fragment key={`${tio.id}.${tio.lap}`}>
                    <div
                        onDragEnter={() => setDropTarget(`${tio.id}.${tio.lap}`)}
                        onDragLeave={() => setDropTarget("")}
                        className={classNames(
                            "w-32 bg-red-100 transition-all",
                            `${tio.id}.${tio.lap}` === dropTarget ? "h-12" : "h-2",
                        )}></div>
                    <div
                        draggable
                        onDragStart={() => setDragTarget(`${tio.id}.${tio.lap}`)}
                        onDragEnd={() => setDragTarget("")}
                        key={`${tio.id}.${tio.lap}`}
                        className={classNames(
                            "my-2 flex w-32 cursor-pointer rounded-md border-2 bg-gray-100 px-3 py-1.5",
                            `${tio.id}.${tio.lap}` === dragTarget ? "border-dashed border-gray-400" : "border-transparent opacity-100",
                        )}>
                        <div>{tio.name}</div>
                        <div className="flex-grow"></div>
                        <Icon
                            className="opacity-25 transition-all hover:opacity-50 active:opacity-100"
                            path={mdiGestureTapHold}
                            size={1}></Icon>
                    </div>
                </React.Fragment>
            ))}
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

    const { data: timingPointsOrder, refetch: refetchOrder } = trpc.timingPoint.timingPointsOrder.useQuery(
        { raceId: raceId },
        {
            initialData: [],
        },
    );

    const sortedTimingPoints = timingPointsOrder.map(point => timingPoints.find(tp => point === tp.id)!);

    const timesInOrder = timingPoints.flatMap(tp => createRange({ from: 0, to: tp.laps }).map(lap => ({ ...tp, lap })));

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
                <div>
                    <TimingPointsOrder timesInOrder={timesInOrder} />
                </div>
            </div>
        </>
    );
};
