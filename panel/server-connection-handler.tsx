import { allowedLatency, onConnectionStateChanged } from "./connection";
import { ReactNode, useEffect } from "react";
import { trpc } from "./trpc-core";
import { useSetAtom } from "jotai";
import { connectionStateAtom, timeOffsetAtom } from "states/stopwatch-states";
import { logger } from "utils";
import { useSystemTime } from "hooks";

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
    trpc.action.actionDispatched.useSubscription(
        { raceId, clientId },
        {
            onData: action => {
                logger.log(action);
                dispatch({ ...action, __remote: true });
            },
            onError: console.error,
        },
    );

    const ntpMutation = trpc.ntp.sync.useMutation();

    const systemTime = useSystemTime(allowedLatency, ntpMutation.mutateAsync);

    const { refetch: refetchState } = trpc.action.state.useQuery(
        { raceId },
        {
            enabled: false,
            onSuccess: (state: any) => dispatch({ type: "REPLACE_STATE", state, __remote: true }),
        },
    );

    const setTimeOffset = useSetAtom(timeOffsetAtom);
    const setConnectionState = useSetAtom(connectionStateAtom);

    useEffect(() => {
        systemTime && setTimeOffset(systemTime?.timeOffset);
    }, [systemTime]);

    useEffect(() => {
        refetchState();

        const connectionStateChangedUnsub = onConnectionStateChanged(connectionState => {
            setConnectionState(connectionState);
        });

        return () => {
            connectionStateChangedUnsub();
        };
    }, [dispatch]);

    return <>{children}</>;
};
