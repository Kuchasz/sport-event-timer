import { add, reset, update } from "@set/timer/dist/slices/time-stamps";
import { BottomMenu } from "./components/bottom-menu";
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes
    } from "react-router-dom";
import { Config } from "./components/config";
import { CurrentTimeKeeperContext } from "./contexts/current-time-keeper";
import { getCurrentTime } from "./utils";
import { OfflineContext } from "./contexts/offline";
import { PlayersAssignTime } from "./components/players-assign-time";
import { PlayersDialPad } from "./components/players-dial-pad";
import { PlayersList } from "./components/players-list";
import { PlayersReassignTime } from "./components/players-reassign-time";
import { PlayersTimes } from "./components/players-times";
import { Status } from "./components/status";
import { TimeOffsetContext } from "./contexts/time-offset";
import { TweakTimeStamps } from "./components/tweak-time-stamp";
import { useState } from "react";
import { useTimerDispatch, useTimerSelector } from "./hooks";

const selectedTimeKeeperStorageKey = "state.selectedTimeKeeper";

const storedSelectedTimeKeeper =
    Number.parseInt(String(localStorage.getItem(selectedTimeKeeperStorageKey))) ?? undefined;

function App() {
    const allPlayers = useTimerSelector((x) => x.players);
    const allTimeStamps = useTimerSelector((x) => x.timeStamps);
    const [selectedTimeKeeper, setSelectedTimeKeeper] = useState<number | undefined>(storedSelectedTimeKeeper);
    const allTimeKeepers = useTimerSelector((x) => x.timeKeepers);

    const dispatch = useTimerDispatch();

    const playersWithTimeStamps = (timeKeeperId: number) =>
        allPlayers.map((x) => ({
            ...x,
            timeStamp: allTimeStamps.find((a) => a.playerId === x.id && a.timeKeeperId === timeKeeperId)
        }));

    const timeStampsWithPlayers = (timeKeeperId: number) =>
        allTimeStamps
            .filter((s) => s.timeKeeperId === timeKeeperId)
            .map((s) => ({
                ...s,
                player: allPlayers.find((p) => s.playerId === p.id)
            }));

    return (
        <CurrentTimeKeeperContext.Provider
            value={{
                timeKeeperId: allTimeKeepers.find((tk) => tk.id === selectedTimeKeeper)?.id,
                setTimeKeeperId: (timeKeeperId) => {
                    setSelectedTimeKeeper(timeKeeperId);
                    localStorage.setItem(selectedTimeKeeperStorageKey, timeKeeperId.toString());
                }
            }}
        >
            <Router>
                <div id="app-holder" className="flex flex-col overflow-hidden bg-zinc-800 h-full w-screen text-white">
                    <Status timeKeeperName={allTimeKeepers.find((tk) => tk.id === selectedTimeKeeper)?.name} />
                    <div id="module-holder" className="relative overflow-hidden flex-col flex-1">
                        <div className="h-full flex-1 overflow-y-scroll">
                            <TimeOffsetContext.Consumer>
                                {({ offset }) => (
                                    <CurrentTimeKeeperContext.Consumer>
                                        {({ timeKeeperId }) => (
                                            <OfflineContext.Consumer>
                                                {({ isOffline }) =>
                                                    isOffline ? (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <div className="flex-col">
                                                                <div className="text-4xl font-semibold">
                                                                    APP IS OFFLINE ;(
                                                                </div>
                                                                <div className="">
                                                                    Wait for the app to reconnect or kill the app and
                                                                    run it again
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Routes>
                                                            <Route
                                                                path={`${process.env.PUBLIC_URL}/`}
                                                                element={
                                                                    <Navigate to={`${process.env.PUBLIC_URL}/config`} />
                                                                }
                                                            />
                                                            <Route
                                                                path={`${process.env.PUBLIC_URL}/config`}
                                                                element={<Config />}
                                                            />
                                                            {timeKeeperId !== undefined && (
                                                                <>
                                                                    <Route
                                                                        path={`${process.env.PUBLIC_URL}/list`}
                                                                        element={
                                                                            <PlayersList
                                                                                onTimeRecord={(playerId) =>
                                                                                    dispatch(
                                                                                        add({
                                                                                            playerId,
                                                                                            timeKeeperId,
                                                                                            time: getCurrentTime(offset)
                                                                                        })
                                                                                    )
                                                                                }
                                                                                onTimeReset={(timeStampId) =>
                                                                                    dispatch(reset({ id: timeStampId }))
                                                                                }
                                                                                players={playersWithTimeStamps(
                                                                                    timeKeeperId
                                                                                )}
                                                                            />
                                                                        }
                                                                    />
                                                                    <Route
                                                                        path={`${process.env.PUBLIC_URL}/pad`}
                                                                        element={
                                                                            <PlayersDialPad
                                                                                offset={offset}
                                                                                timeKeeperId={timeKeeperId}
                                                                            />
                                                                        }
                                                                    />
                                                                    <Route
                                                                        path={`${process.env.PUBLIC_URL}/assign/:timeStampToAssignId`}
                                                                        children={({ match }: { match: any }) => (
                                                                            <PlayersAssignTime
                                                                                timeStampToAssign={parseInt(
                                                                                    match.params.timeStampToAssignId
                                                                                )}
                                                                                timeKeeperId={timeKeeperId}
                                                                            />
                                                                        )}
                                                                    ></Route>
                                                                    <Route
                                                                        path={`${process.env.PUBLIC_URL}/reassign/:timeStampToAssignId`}
                                                                        children={({ match }: { match: any }) => (
                                                                            <PlayersReassignTime
                                                                                timeStampToAssign={parseInt(
                                                                                    match.params.timeStampToAssignId
                                                                                )}
                                                                                timeKeeperId={timeKeeperId}
                                                                            />
                                                                        )}
                                                                    ></Route>
                                                                    <Route
                                                                        path={`${process.env.PUBLIC_URL}/times`}
                                                                        element={
                                                                            <PlayersTimes
                                                                                onAddTime={() => {
                                                                                    dispatch(
                                                                                        add({
                                                                                            timeKeeperId,
                                                                                            time: getCurrentTime(offset)
                                                                                        })
                                                                                    );
                                                                                }}
                                                                                times={timeStampsWithPlayers(
                                                                                    timeKeeperId
                                                                                )}
                                                                                timeKeeperId={selectedTimeKeeper}
                                                                            />
                                                                        }
                                                                    />
                                                                    <Route
                                                                        path={`${process.env.PUBLIC_URL}/tweak/:timeStampId`}
                                                                        children={({ match }: { match: any }) => (
                                                                            <TweakTimeStamps
                                                                                timeStampId={parseInt(
                                                                                    match.params.timeStampId
                                                                                )}
                                                                                onSave={(timeStamp) => {
                                                                                    dispatch(update(timeStamp));
                                                                                }}
                                                                            />
                                                                        )}
                                                                    />
                                                                </>
                                                            )}
                                                        </Routes>
                                                    )
                                                }
                                            </OfflineContext.Consumer>
                                        )}
                                    </CurrentTimeKeeperContext.Consumer>
                                )}
                            </TimeOffsetContext.Consumer>
                        </div>
                    </div>
                    <div>
                        <BottomMenu />
                    </div>
                </div>
            </Router>
        </CurrentTimeKeeperContext.Provider>
    );
}

export default App;
