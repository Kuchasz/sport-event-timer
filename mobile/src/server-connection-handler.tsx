import { ConnectionState, onConnectionStateChanged, socket } from "./connection";
import { OfflineContext } from "./contexts/offline";
import { ReactNode, useEffect, useState } from "react";
import { TimeOffsetContext } from "./contexts/time-offset";

export const ServerConnectionHandler = ({
    dispatch,
    children
}: {
    dispatch: (action: any) => void;
    children: ReactNode;
}) => {
    const [timeOffset, setTimeOffset] = useState<number>(0);
    const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");

    useEffect(() => {
        socket.on("receive-action", (action) => dispatch({ ...action, __remote: true }));
        socket.on("receive-state", (state) => dispatch({ type: "REPLACE_STATE", state, __remote: true }));
        socket.on("sync-time", (time) => {
            const newTimeOffset = -(Date.now() - time);
            setTimeOffset(newTimeOffset);
        });
        onConnectionStateChanged(setConnectionState);
    }, [dispatch]);

    return (
        <TimeOffsetContext.Provider value={{ offset: timeOffset }}>
            <OfflineContext.Provider value={{ isOffline: connectionState !== "connected" }}>
                {children}
            </OfflineContext.Provider>
        </TimeOffsetContext.Provider>
    );
};
