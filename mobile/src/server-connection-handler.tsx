import { onConnectionStateChanged } from "./connection";
import { ReactNode, useEffect } from "react";
import { setConnectionState, setTimeOffset } from "@set/timer/dist/slices/time-keeper-config";
import { trpc } from "./trpc";

export const ServerConnectionHandler = ({
    dispatch,
    children,
    clientId
}: {
    dispatch: (action: any) => void;
    children: ReactNode;
    clientId: string;
}) => {
    trpc.useSubscription(["action.action-dispatched", { clientId }], {
        onNext: action => dispatch({ ...action, __remote: true }),
        onError: console.error
    });

    const { refetch: refetchState } = trpc.useQuery(["action.state"], {
        enabled: false,
        onSuccess: (state: any) => dispatch({ type: "REPLACE_STATE", state, __remote: true })
    });
    const ntpMutation = trpc.useMutation(["ntp.sync"]);

    useEffect(() => {
        // socket.on("receive-state", state => dispatch({ type: "REPLACE_STATE", state, __remote: true }));

        refetchState();

        let loadStartTime = Date.now();

        const requestTimeSync = async () => {
            const serverTime: number = await ntpMutation.mutateAsync(loadStartTime);
            const loadEndTime = Date.now();
            const latency = loadEndTime - loadStartTime;

            const timeOffset = -(loadEndTime - Math.floor(serverTime + latency / 2));

            console.log(timeOffset);

            dispatch(setTimeOffset({ timeOffset }));

            if (latency <= 200) {
                clearInterval(timeSyncInterval);
            }
        };

        const timeSyncInterval = setInterval(() => {
            loadStartTime = Date.now();
            requestTimeSync();
        }, 1000);

        const connectionStateChangedUnsub = onConnectionStateChanged(connectionState => {
            //dispatch connectionState !== "connected"
            // console.log("dispatch connectionState ", connectionState);
            dispatch(setConnectionState({ connectionState }));
        });

        return () => {
            clearInterval(timeSyncInterval);
            connectionStateChangedUnsub();
            // socket.removeAllListeners();
            // socket.disconnect();
        };
    }, [dispatch, refetchState, ntpMutation]);

    return <>{children}</>;
};
