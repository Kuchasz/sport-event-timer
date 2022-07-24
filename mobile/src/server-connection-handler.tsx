import { getConnection, onConnectionStateChanged } from "./connection";
import { ReactNode, useEffect } from "react";
import { setConnectionState, setTimeOffset } from "@set/timer/dist/slices/time-keeper-config";
import { trpc } from "./trpc";

require("react-dom");
(window as any).React2 = require("react");
console.log((window as any).React1, (window as any).React2, (window as any).React1 === (window as any).React2);

export const ServerConnectionHandler = ({
    dispatch,
    children
}: {
    dispatch: (action: any) => void;
    children: ReactNode;
}) => {
    trpc.useSubscription(["action.action-dispatched"], {
        onNext: action => dispatch({ ...action, __remote: true }),
        onError: console.error
    });

    const { refetch: refetchState } = trpc.useQuery(["action.state"], {
        enabled: false,
        onSuccess: (state: any) => dispatch({ type: "REPLACE_STATE", state, __remote: true })
    });
    const ntpMutation = trpc.useMutation(["ntp.sync"]);

    useEffect(() => {
        // const aaa = trpc.useQuery(["race.races"]);
        // trpc.useSubscription(["action.onDispatched"], {
        //     onNext: action => dispatch({ ...action, __remote: true }),
        //     onError: console.error
        // });
        // const socket = getConnection();

        // socket.on("receive-action", action => dispatch({ ...action, __remote: true }));
        // socket.on("receive-state", state => dispatch({ type: "REPLACE_STATE", state, __remote: true }));

        refetchState();

        let loadStartTime = Date.now();

        const requestTimeSync = async () => {
            const serverTime: number = await ntpMutation.mutateAsync(loadStartTime);
            const loadEndTime = Date.now();
            const latency = loadEndTime - loadStartTime;

            const timeOffset = -(loadEndTime - (serverTime + latency / 2));

            dispatch(setTimeOffset({ timeOffset }));

            if (latency <= 50) {
                clearInterval(timeSyncInterval);
            }
        };

        const timeSyncInterval = setInterval(() => {
            loadStartTime = Date.now();
            requestTimeSync();
        }, 1000);

        const connectionStateChangedUnsub = onConnectionStateChanged(connectionState => {
            //dispatch connectionState !== "connected"
            console.log("dispatch connectionState ", connectionState);
            dispatch(setConnectionState({ connectionState }));
        });

        return () => {
            clearInterval(timeSyncInterval);
            connectionStateChangedUnsub();
            // socket.removeAllListeners();
            // socket.disconnect();
        };
    }, [dispatch]);

    return <>{children}</>;
};
