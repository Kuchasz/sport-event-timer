"use client";

import { TimingPointIcon } from "../../../../../../components/stopwatch/timing-point-icon";
import { timingPointIdAtom } from "states/stopwatch-states";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import Icon from "@mdi/react";
import { mdiCheck } from "@mdi/js";
import classNames from "classnames";
import { trpc } from "trpc-core";

export const Config = () => {
    const [timingPointId, chooseTimingPoint] = useAtom(timingPointIdAtom);
    const { raceId } = useParams<{ raceId: string }>()!;

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
            <div className="flex h-full w-full flex-grow flex-col items-center justify-center">
                {sortedTimingPoints.map((tk, id) => (
                    <button
                        onClick={() => setTimingPointId(tk.id)}
                        className="relative my-2 flex items-center rounded-xl bg-white px-3 py-2 shadow transition-opacity"
                        key={tk.id}
                    >
                        <TimingPointIcon isFirst={id === 0} isLast={id === sortedTimingPoints.length - 1} />
                        <span className="ml-4 text-xl">{tk.name}</span>
                        <Icon
                            className={classNames("transition-all", { ["ml-3"]: tk.id === timingPointId })}
                            size={tk.id === timingPointId ? 1 : 0}
                            path={mdiCheck}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};
