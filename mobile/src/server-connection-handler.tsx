import { ReactNode, useEffect, useState } from "react";
import { socket } from "./connection";
import { TimeOffsetContext } from "./contexts/time-offset";

export const ServerConnectionHandler = ({
    dispatch,
    children
}: {
    dispatch: (action: any) => void;
    children: ReactNode;
}) => {
    const [timeOffset, setTimeOffset] = useState<number>(0);

    useEffect(() => {
        socket.on("receive-action", (action) => dispatch({ ...action, __remote: true }));
        socket.on("receive-state", (state) => dispatch({ type: "REPLACE_STATE", state, __remote: true }));
        socket.on("sync-time", (time) => {
            const newTimeOffset = -(Date.now() - time);
            console.log("timeOffset: ", newTimeOffset, "ms");
            setTimeOffset(newTimeOffset);
        });
    }, [dispatch]);

    return <TimeOffsetContext.Provider value={{ offset: timeOffset }}>{children}</TimeOffsetContext.Provider>;
};
