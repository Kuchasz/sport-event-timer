"use client";

import { TimingPointIcon } from "../../../../../../components/stopwatch/timing-point-icon";
import { timingPointIdAtom } from "src/states/stopwatch-states";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import Icon from "@mdi/react";
import { mdiCheck } from "@mdi/js";
import classNames from "classnames";
import { trpc } from "src/trpc-core";
import { useTranslations } from "next-intl";

export const Settings = () => {
    const [timingPointId, chooseTimingPoint] = useAtom(timingPointIdAtom);
    const { raceId } = useParams<{ raceId: string }>()!;

    const t = useTranslations();

    const { data: allTimingPoints } = trpc.timingPoint.timingPoints.useQuery(
        { raceId: parseInt(raceId) },
        {
            initialData: [],
        },
    );

    const setTimingPointId = (timingPointId: number) => {
        chooseTimingPoint(timingPointId);
    };

    return (
        <div className="flex h-full w-full flex-col items-center">
            <div className="flex h-full w-full flex-grow flex-col p-4">
                <div className="font-semibold">{t("stopwatch.settings.selectTimingPoint.header")}</div>
                <div className="mb-2 text-xs">{t("stopwatch.settings.selectTimingPoint.description")}</div>
                {allTimingPoints.map((timingPoint, id) => (
                    <button
                        onClick={() => setTimingPointId(timingPoint.id)}
                        className="relative my-2 flex w-full items-center rounded-lg bg-white px-5 py-3 shadow-sm"
                        key={timingPoint.id}>
                        <TimingPointIcon isFirst={id === 0} isLast={id === allTimingPoints.length - 1} />
                        <div className="mx-4 flex flex-grow flex-col items-start">
                            <div className="">{timingPoint.name}</div>
                            <div className="text-xs leading-none opacity-75">{timingPoint.description}</div>
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
                    </button>
                ))}
            </div>
        </div>
    );
};
