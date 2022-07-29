import { CurrentRaceContext } from "current-race-context";
import { useContext } from "react";

export const useCurrentRaceId = () => useContext(CurrentRaceContext).raceId;
