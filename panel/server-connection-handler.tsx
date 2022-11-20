import { onConnectionStateChanged } from "./connection";
import { ReactNode, useEffect } from "react";
import { trpc } from "./connection";
import { useSetAtom } from "jotai";
import { connectionStateAtom, timeOffsetAtom } from "stopwatch-states";
import { logger } from "utils";

export const ServerConnectionHandler = ({
    dispatch,
    children,
    raceId,
    clientId,
}: {
    dispatch: (action: any) => void;
    children: ReactNode;
    raceId: number;
    clientId: string;
}) => {
    
    trpc.action.actionDispatched.useSubscription({ raceId, clientId }, {
        onData: (action) => dispatch({ ...action, __remote: true }),
        onError: console.error,
    });

    const { refetch: refetchState } = trpc.action.state.useQuery({ raceId }, {
        enabled: false,
        onSuccess: (state: any) => dispatch({ type: "REPLACE_STATE", state, __remote: true }),
    });

    const setTimeOffset = useSetAtom(timeOffsetAtom);
    const setConnectionState = useSetAtom(connectionStateAtom);

    const ntpMutation = trpc.ntp.sync.useMutation();

    useEffect(() => {
        // socket.on("receive-state", state => dispatch({ type: "REPLACE_STATE", state, __remote: true }));

        refetchState();

        let loadStartTime = Date.now();
        let timeout: any;
        const requestTimeSync = async () => {

            const serverTime: number = await ntpMutation.mutateAsync(loadStartTime);
            const loadEndTime = Date.now();
            const latency = loadEndTime - loadStartTime;

            const timeOffset = -(loadEndTime - Math.floor(serverTime + latency / 2));

            logger.log('requestTimeSync', timeOffset);

            setTimeOffset(timeOffset);

            if (latency <= 200) {
                // clearInterval(timeSyncInterval);
            } else {
                loadStartTime = Date.now();
                timeout = setTimeout(requestTimeSync, 1000);
            }
        };

        // const timeSyncInterval = setInterval(() => {
        //     loadStartTime = Date.now();
        //     requestTimeSync();
        // }, 1000);

        const connectionStateChangedUnsub = onConnectionStateChanged((connectionState) => {
            //dispatch connectionState !== "connected"
            // console.log("dispatch connectionState ", connectionState);
            setConnectionState(connectionState);
        });

        requestTimeSync();

        return () => {
            clearTimeout(timeout);
            // clearInterval(timeSyncInterval);
            connectionStateChangedUnsub();
            // socket.removeAllListeners();
            // socket.disconnect();
        };
    }, [dispatch]);

    return <>{children}</>;
};
