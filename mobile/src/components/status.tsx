import Icon from "@mdi/react";
import { ConnectionState, onConnectionStateChanged } from "../connection";
import {
    mdiCloudOffOutline,
    mdiCloudOutline,
    mdiCloudSyncOutline,
    mdiWeatherCloudyAlert
    } from "@mdi/js";
import { Timer } from "./timer";
import { useEffect, useState } from "react";

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

type StatusProps = { timeKeeperName: string };
export const Status = ({ timeKeeperName }: StatusProps) => {
    const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");

    useEffect(() => {
        const unregister = onConnectionStateChanged(setConnectionState);
        return () => unregister();
    }, []);

    return (
        <div className="px-5 w-screen flex-shrink-0 flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-500 font-semibold h-10">
            <span>{timeKeeperName}</span>
            <Timer />
            <Icon path={getIconFromConnectionState(connectionState)} size={1} />
        </div>
    );
};
