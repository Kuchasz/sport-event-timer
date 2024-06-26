import { allowedLatency, onConnectionStateChanged } from "./connection";
import { useEffect } from "react";
import { trpc } from "./trpc-core";
import { useSetAtom } from "jotai";
import { connectionStateAtom, timeOffsetAtom } from "src/states/stopwatch-states";
import { logger } from "src/utils";
import { useSystemTime } from "src/hooks";
import { replaceState } from "@set/timer/dist/store";

export const ServerConnectionHandler = ({
    dispatch,
    children,
    raceId,
    clientId,
}: {
    dispatch: (action: any) => void;
    children: React.ReactNode;
    raceId: number;
    clientId: string;
}) => {
    trpc.action.actionDispatched.useSubscription(
        { raceId, clientId },
        {
            onData: action => {
                logger.log(action);
                dispatch({ ...action, meta: { remote: true } });
            },
            onError: console.error,
        },
    );

    const ntpMutation = trpc.ntp.sync.useMutation();

    const systemTime = useSystemTime(allowedLatency, ntpMutation.mutateAsync);

    const { refetch: refetchState, data: state } = trpc.action.state.useQuery({ raceId }, { enabled: false });

    useEffect(() => {
        if (state) dispatch(replaceState(state));
    }, [state]);

    const setTimeOffset = useSetAtom(timeOffsetAtom);
    const setConnectionState = useSetAtom(connectionStateAtom);

    useEffect(() => {
        systemTime && setTimeOffset(systemTime?.timeOffset);
    }, [systemTime]);

    useEffect(() => {
        void refetchState();

        const connectionStateChangedUnsub = onConnectionStateChanged(connectionState => {
            setConnectionState(connectionState);
        });

        return () => {
            connectionStateChangedUnsub();
        };
    }, [dispatch]);

    return <>{children}</>;
};
