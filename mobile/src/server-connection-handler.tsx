import { getConnection, onConnectionStateChanged } from "./connection";
import { ReactNode, useEffect } from "react";
import { setConnectionState, setTimeOffset } from "@set/timer/dist/slices/time-keeper-config";

export const ServerConnectionHandler = ({
    dispatch,
    children
}: {
    dispatch: (action: any) => void;
    children: ReactNode;
}) => {
    useEffect(() => {
        const socket = getConnection();

        socket.on("receive-action", (action) => dispatch({ ...action, __remote: true }));
        socket.on("receive-state", (state) => dispatch({ type: "REPLACE_STATE", state, __remote: true }));

        let loadStartTime = Date.now();
        socket.on("TR", (serverTime) => {
            const loadEndTime = Date.now();
            const latency = loadEndTime - loadStartTime;

            const timeOffset = -(loadEndTime - (serverTime + latency / 2));

            dispatch(setTimeOffset({ timeOffset }));

            if (latency <= 50) {
                clearInterval(timeSyncInterval);
            }
        });

        const timeSyncInterval = setInterval(() => {
            loadStartTime = Date.now();
            socket.emit("TQ");
        }, 1000);

        const connectionStateChangedUnsub = onConnectionStateChanged((connectionState) => {
            //dispatch connectionState !== "connected"
            dispatch(setConnectionState({ connectionState }));
        });

        return () => {
            clearInterval(timeSyncInterval);
            connectionStateChangedUnsub();
            socket.removeAllListeners();
            // socket.disconnect();
        };
    }, [dispatch]);

    return <>{children}</>;
};
