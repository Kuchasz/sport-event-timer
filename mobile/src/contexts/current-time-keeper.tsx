import { createContext } from "react";

export const CurrentTimeKeeperContext = createContext<{
    timeKeeperId?: number;
    setTimeKeeperId: (timeKeeperId: number) => void;
}>({
    timeKeeperId: undefined,
    setTimeKeeperId: () => {}
});
