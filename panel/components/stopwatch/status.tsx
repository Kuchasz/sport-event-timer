import { ConnectionState } from "../../connection";
import { Icon } from "@mdi/react";
import { mdiCloudOffOutline, mdiCloudOutline, mdiCloudSyncOutline, mdiWeatherCloudyAlert } from "@mdi/js";
import { sort } from "@set/shared/dist";
import { TimeKeeperIcon } from "./time-keeper-icon";
import { Timer } from "./timer";
import { useTimerSelector } from "../../hooks";
import { useAtom } from "jotai";
import { connectionStateAtom, timeKeeperIdAtom, timeOffsetAtom } from "stopwatch-states";
import { useRouter } from "next/router";
import { trpc } from "trpc";

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

export const Status = () => {
    const [connectionState] = useAtom(connectionStateAtom);
    const {
        query: { raceId },
    } = useRouter();
    const { data: allTimeKeepers } = trpc.useQuery(["timing-point.timingPoints", { raceId: parseInt(raceId as string) }], {
        initialData: [],
    });
    const [timeKeeperId] = useAtom(timeKeeperIdAtom);
    const [offset] = useAtom(timeOffsetAtom);
    const timeKeeperName = allTimeKeepers?.find((tk) => tk.id === timeKeeperId)?.name;
    const sortedTimeKeepers = sort(allTimeKeepers || [], (tk) => tk.order).map((tk) => tk.id);

    return (
        <div className="px-5 w-screen flex-shrink-0 flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-500 font-semibold h-10">
            <span className="flex">
                {timeKeeperId !== undefined && allTimeKeepers?.length && (
                    <TimeKeeperIcon isFirst={sortedTimeKeepers[0] === timeKeeperId} isLast={false} />
                )}
                <span>{timeKeeperName ?? "NO_TIMEKEEPER"}</span>
            </span>
            <Timer offset={offset!} />
            <span className="text-xs flex items-center">
                <span className="mr-2">{getTextFromConnectionState(connectionState)}</span>
                <Icon path={getIconFromConnectionState(connectionState)} size={1} />
            </span>
        </div>
    );
};
