import { ConnectionState, onConnectionStateChanged } from "../connection";
import { Timer } from "./timer";
import { useEffect, useState } from "react";
type StatusProps = { timeKeeperName: string };
export const Status = ({ timeKeeperName }: StatusProps) => {
    const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");

    useEffect(() => {
        const unregister = onConnectionStateChanged(setConnectionState);
        return () => unregister();
    }, []);

    return (
        <div className="px-5 w-screen flex-shrink-0 flex items-center justify-between bg-white font-semibold text-black border h-10">
            <span className="mr-4">{timeKeeperName}</span>
            {connectionState}
            <Timer />
        </div>
    );
};
