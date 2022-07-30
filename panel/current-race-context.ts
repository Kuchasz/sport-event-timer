import React from "react";

const initialContextValue = { raceId: undefined as undefined | number, selectRace: (_raceId: number) => {} } as const;

export const CurrentRaceContext = React.createContext<typeof initialContextValue>(initialContextValue);
CurrentRaceContext.displayName = "CurrentRace";
