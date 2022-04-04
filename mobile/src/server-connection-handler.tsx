import { getConnection, onConnectionStateChanged } from "./connection";
import { getCurrentTimeOffset } from "./api";
import { ReactNode, useEffect } from "react";
import { setConnectionState, setTimeOffset } from "@set/timer/dist/slices/time-keeper-config";

export const ServerConnectionHandler = ({
    dispatch,
    children
}: {
    dispatch: (action: any) => void;
    children: ReactNode;
}) => {
    console.log("ServerConnectionHandler");

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
            dispatch(setConnectionState({ connectionState }));
        });

        return () => {
            connectionStateChangedUnsub();
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, [dispatch]);

    return <>{children}</>;
};
