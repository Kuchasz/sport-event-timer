"use client";

import { TimingPointIcon } from "../../../../../../components/stopwatch/timing-point-icon";
import { timingPointIdAtom } from "states/stopwatch-states";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import Icon from "@mdi/react";
import { mdiCheck } from "@mdi/js";
import classNames from "classnames";
import { trpc } from "trpc-core";
import { useTranslations } from "next-intl";

export const Config = () => {
    const [timingPointId, chooseTimingPoint] = useAtom(timingPointIdAtom);
    const { raceId } = useParams<{ raceId: string }>()!;

    const t = useTranslations();

    const { data: allTimingPoints } = trpc.timingPoint.timingPoints.useQuery(
        { raceId: parseInt(raceId) },
        {
            initialData: [],
        },
    );

    const { data: timingPointsOrder } = trpc.timingPoint.timingPointsOrder.useQuery(
        { raceId: parseInt(raceId) },
        {
            initialData: [],
        },
    );

    const sortedTimingPoints = timingPointsOrder.map(point => allTimingPoints.find(tp => point === tp.id)!);

    const setTimingPointId = (timingPointId: number) => {
        chooseTimingPoint(timingPointId);
    };

    return (
        <div className="flex h-full w-full flex-col items-center">
            <div className="flex h-full w-full flex-grow flex-col justify-center px-4">
                <div className="font-semibold">{t("stopwatch.config.selectTimingPoint.header")}</div>
                <div className="text-xs">{t("stopwatch.config.selectTimingPoint.description")}</div>
                {sortedTimingPoints.map((timingPoint, id) => (
                    <button
                        onClick={() => setTimingPointId(timingPoint.id)}
                        className="relative my-2 flex w-full items-center px-3 py-2"
                        key={timingPoint.id}>
                        <TimingPointIcon isFirst={id === 0} isLast={id === sortedTimingPoints.length - 1} />
                        <div className="mx-4 flex flex-grow flex-col items-start">
                            <div className="font-semibold">{timingPoint.name}</div>
                            <div className="text-xs opacity-75">{timingPoint.description}</div>
                        </div>
                        <div className="flex h-6 w-6 items-center justify-center">
                            <div
                                className={classNames("flex h-4 w-4 items-center justify-center rounded-full bg-gray-300 transition-all", {
                                    ["h-6 w-6 bg-orange-500"]: timingPoint.id === timingPointId,
                                })}>
                                <Icon
                                    className={classNames("text-white transition-all")}
                                    size={timingPoint.id === timingPointId ? 0.5 : 0}
                                    path={mdiCheck}
                                />
                            </div>
                        </div>
                        {/* <Icon
                            className={classNames("transition-all", { ["ml-3"]: timingPoint.id === timingPointId })}
                            size={timingPoint.id === timingPointId ? 1 : 0}
                            path={mdiCheck}
                        /> */}
                    </button>
                ))}
            </div>
        </div>
    );
};
