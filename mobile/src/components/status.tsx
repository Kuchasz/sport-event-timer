import usePortal from "react-useportal";
import { ConnectionState, onConnectionStateChanged } from "../connection";
import { CurrentTimeKeeperContext } from "../contexts/current-time-keeper";
import { Icon } from "@mdi/react";
import {
    mdiCloudOffOutline,
    mdiCloudOutline,
    mdiCloudSyncOutline,
    mdiWeatherCloudyAlert
    } from "@mdi/js";
import { TimeKeeperIcon } from "./time-keeper-icon";
import { TimeKeeperSelector } from "./time-keeper-selector";
import { Timer } from "./timer";
import { useEffect, useState } from "react";
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

type StatusProps = { timeKeeperName?: string };
export const Status = ({ timeKeeperName }: StatusProps) => {
    const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
    const [showTimeKeeperSelector, setShowTimeKeeperSelector] = useState<boolean>(false);
    const { Portal } = usePortal({ bindTo: document.getElementById("app-holder") as HTMLElement });
    const allTimeKeepers = useTimerSelector((x) => x.timeKeepers);

    useEffect(() => {
        const unregister = onConnectionStateChanged(setConnectionState);
        return () => unregister();
    }, []);

    return (
        <CurrentTimeKeeperContext.Consumer>
            {({ timeKeeperId, setTimeKeeperId }) => (
                <div className="px-5 w-screen flex-shrink-0 flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-500 font-semibold h-10">
                    {showTimeKeeperSelector && (
                        <Portal>
                            <TimeKeeperSelector
                                timeKeepers={allTimeKeepers}
                                selectedTimeKeeper={allTimeKeepers.find((tk) => tk.id === timeKeeperId)}
                                timeKeeperChosen={(timeKeeperId) => {
                                    setShowTimeKeeperSelector(false);
                                    setTimeKeeperId(timeKeeperId);
                                }}
                            ></TimeKeeperSelector>
                        </Portal>
                    )}
                    <span className="flex" onClick={() => setShowTimeKeeperSelector(true)}>
                        {timeKeeperId !== undefined && (
                            <TimeKeeperIcon type={allTimeKeepers.find((tk) => tk.id === timeKeeperId)!.type} />
                        )}
                        <span>{timeKeeperName ?? "CHOOSE"}</span>
                    </span>
                    <Timer />
                    <span className="text-xs flex items-center">
                        <span className="mr-2">{getTextFromConnectionState(connectionState)}</span>
                        <Icon path={getIconFromConnectionState(connectionState)} size={1} />
                    </span>
                </div>
            )}
        </CurrentTimeKeeperContext.Consumer>
    );
};
