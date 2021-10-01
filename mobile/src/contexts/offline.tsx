import { createContext } from "react";
export const OfflineContext = createContext<{ isOffline: boolean }>({ isOffline: true });
