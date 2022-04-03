import { getConnection, onConnectionStateChanged } from "./connection";
import { getCurrentTimeOffset } from "./api";
import { ReactNode, useEffect } from "react";
import { setIsOffline, setTimeOffset } from "@set/timer/dist/slices/time-keeper-config";

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

        getCurrentTimeOffset().then((timeOffset) => {
            //dispatch timeOffset
            dispatch(setTimeOffset({ timeOffset }));
        });

        const connectionStateChangedUnsub = onConnectionStateChanged((connectionState) => {
            //dispatch connectionState !== "connected"
            dispatch(setIsOffline({ isOffline: connectionState !== "connected" }));
        });

        return () => {
            connectionStateChangedUnsub();
            socket.disconnect();
        };
    }, [dispatch]);

    return <>{children}</>;
};
