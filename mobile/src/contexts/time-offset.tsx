import { createContext } from "react";
export const TimeOffsetContext = createContext<{ offset: number }>({ offset: 0 });
