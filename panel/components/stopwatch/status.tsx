import { ConnectionState } from "../../connection";
import { Icon } from "@mdi/react";
import { mdiCloudOffOutline, mdiCloudOutline, mdiCloudSyncOutline, mdiWeatherCloudyAlert } from "@mdi/js";
import { sort } from "@set/shared/dist";
import { TimeKeeperIcon } from "./time-keeper-icon";
import { Timer } from "./timer";
import { useAtom } from "jotai";
import { connectionStateAtom, timingPointIdAtom, timeOffsetAtom } from "stopwatch-states";
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
    const [timingPointId] = useAtom(timingPointIdAtom);
    const [offset] = useAtom(timeOffsetAtom);
    const timeKeeperName = allTimeKeepers?.find((tk) => tk.id === timingPointId)?.name;
    const sortedTimeKeepers = sort(allTimeKeepers || [], (tk) => tk.order).map((tk) => tk.id);

    return (
        <div className="px-5 w-screen flex-shrink-0 flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-500 font-semibold h-10">
            <span className="flex">
                {timingPointId > 0 && allTimeKeepers?.length && (
                    <TimeKeeperIcon isFirst={sortedTimeKeepers[0] === timingPointId} isLast={false} />
                )}
                <span>{timeKeeperName ?? "MISSING CONFIG"}</span>
            </span>
            <Timer offset={offset!} />
            <span className="text-xs flex items-center">
                <span className="mr-2">{getTextFromConnectionState(connectionState)}</span>
                <Icon path={getIconFromConnectionState(connectionState)} size={1} />
            </span>
        </div>
    );
};
