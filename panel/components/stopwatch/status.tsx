import { ConnectionState, trpc } from "../../connection";
import { Icon } from "@mdi/react";
import { mdiCloudOffOutline, mdiCloudOutline, mdiCloudSyncOutline, mdiWeatherCloudyAlert } from "@mdi/js";
import { TimingPointIcon } from "./timing-point-icon";
import { Timer } from "./timer";
import { useAtom } from "jotai";
import Link from "next/link";
import { connectionStateAtom, timingPointIdAtom, timeOffsetAtom } from "states/stopwatch-states";
import { useRouter } from "next/router";

import classNames from "classnames";

const getIconFromConnectionState = (state: ConnectionState) => {
    switch (state) {
        case "connected":
            return mdiCloudOutline;
        case "disconnected":
            return mdiCloudOffOutline;
        case "error":
            return mdiWeatherCloudyAlert;
        case "connecting":
            return mdiCloudSyncOutline;
        default:
            throw new Error("not handled connection state");
    }
};

const getTextFromConnectionState = (state: ConnectionState) => {
    switch (state) {
        case "connected":
            return "ON-LINE";
        case "disconnected":
        case "error":
            return "OFF-LINE";
        case "connecting":
            return "CONNECTING";
        default:
            throw new Error("not handled connection state");
    }
};

const SelectedTimingPoint = ({
    timingPoints,
    timingPointId,
    timingPointName,
}: {
    timingPoints: number[];
    timingPointId: number;
    timingPointName: string | undefined;
}) => (
    <span className="cursor-pointer flex transition-colors hover:bg-zinc-700 bg-zinc-800 text-zinc-300 px-4 py-1 rounded-xl">
        <TimingPointIcon isFirst={timingPoints[0] === timingPointId} isLast={timingPoints[timingPoints.length - 1] === timingPointId} />

        <span className="ml-2">{timingPointName ?? "SELECT TIMING POINT"}</span>
    </span>
);

const WarningMessage = ({ contents }: { contents: string }) => (
    <span className="cursor-pointer flex text-white bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full">
        <span>{contents}</span>
    </span>
);

export const Status = () => {
    const [connectionState] = useAtom(connectionStateAtom);
    const {
        query: { raceId },
    } = useRouter();
    const { data: allTimingPoints } = trpc.timingPoint.timingPoints.useQuery({ raceId: parseInt(raceId as string)}, {
        initialData: [],
    });
    const {data: timingPointOrder } = trpc.timingPoint.timingPointsOrder.useQuery({raceId: parseInt(raceId as string)}, {initialData: []});
    const [timingPointId] = useAtom(timingPointIdAtom);
    const [offset] = useAtom(timeOffsetAtom);
    const timingPointName = allTimingPoints!.find((tk) => tk.id === timingPointId)?.name;
    const sortedTimingPoints = timingPointOrder;

    return (
        <div>
            <span
                className={classNames("text-xs w-full text-white font-semibold transition-all h-0 flex justify-center items-center", {
                    ["invisible"]: connectionState === "connected",
                    ["visible h-auto py-2"]: connectionState !== "connected",
                    ["bg-red-600"]: connectionState === "disconnected" || connectionState === "error",
                    ["bg-orange-600"]: connectionState === "connecting",
                })}
            >
                <span className="mr-2">{getTextFromConnectionState(connectionState)}</span>
                <Icon path={getIconFromConnectionState(connectionState)} size={0.8} />
            </span>
            <div className="px-4 py-2 rounded-b-lg z-10 bg-black text-white w-screen justify-between flex-shrink-0 flex items-center font-semibold">
                <Timer offset={offset!} />
                <Link href={`/stopwatch/${raceId}/config`}>
                    <span>
                        {sortedTimingPoints.length === 0 ? (
                            <WarningMessage contents={"NO TIMING POINTS"} />
                        ) : timingPointId === undefined || timingPointId === null || timingPointId === 0 || !sortedTimingPoints.includes(timingPointId) ? (
                            <WarningMessage contents={"SET TIMING POINT"} />
                        ) : (
                            <SelectedTimingPoint
                                timingPointId={timingPointId}
                                timingPointName={timingPointName}
                                timingPoints={sortedTimingPoints}
                            />
                        )}
                    </span>
                </Link>
            </div>
        </div>
    );
};
