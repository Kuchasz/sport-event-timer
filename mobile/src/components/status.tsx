import { ConnectionState } from "../connection";
import { Icon } from "@mdi/react";
import {
    mdiCloudOffOutline,
    mdiCloudOutline,
    mdiCloudSyncOutline,
    mdiWeatherCloudyAlert
    } from "@mdi/js";
import { TimeKeeperIcon } from "./time-keeper-icon";
import { Timer } from "./timer";
import { useTimerSelector } from "../hooks";

const getIconFromConnectionState = (state: ConnectionState) => {
    switch (state) {
        case "connected":
            return mdiCloudOutline;
        case "disconnected":
            return mdiCloudOffOutline;
        case "error":
            return mdiWeatherCloudyAlert;
        case "reconnecting":
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
        case "reconnecting":
            return "CONNECTING";
        default:
            throw new Error("not handled connection state");
    }
};

type StatusProps = {};
export const Status = ({}: StatusProps) => {
    const connectionState = useTimerSelector((x) => x.timeKeeperConfig.connectionState);
    const allTimeKeepers = useTimerSelector((x) => x.timeKeepers);
    const timeKeeperId = useTimerSelector((x) => x.userConfig?.timeKeeperId);
    const offset = useTimerSelector((x) => x.timeKeeperConfig?.timeOffset);
    const timeKeeperName = allTimeKeepers.find((tk) => tk.id === timeKeeperId)?.name;

    return (
        <div className="px-5 w-screen flex-shrink-0 flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-500 font-semibold h-10">
            <span className="flex">
                {timeKeeperId !== undefined && allTimeKeepers.length && (
                    <TimeKeeperIcon type={allTimeKeepers.find((tk) => tk.id === timeKeeperId)!.type} />
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
