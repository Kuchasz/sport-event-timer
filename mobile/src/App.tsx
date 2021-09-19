import { add, reset } from "@set/timer/slices/time-stamps";
import { CurrentTimeKeeperContext } from "./contexts/current-time-keeper";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { PlayersDialPad } from "./components/players-dial-pad";
import { PlayersList } from "./components/players-list";
import { PlayersTimes } from "./components/players-times";
import { Status } from "./components/status";
import { StopWatchModeSwitch } from "./components/stopwatch-mode-switch";
import { useState } from "react";
import { useTimerDispatch, useTimerSelector } from "./hooks";
function App() {
    const allPlayers = useTimerSelector((x) => x.players);
    const allTimeStamps = useTimerSelector((x) => x.timeStamps);
    const [selectedTimeKeeper, setSelectedTimeKeeper] = useState<number>();
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
            value={{ timeKeeperId: selectedTimeKeeper, setTimeKeeperId: setSelectedTimeKeeper }}
        >
            <Router>
                <div id="app-holder" className="flex flex-col overflow-hidden bg-gray-800 h-full w-screen text-white">
                    <Status timeKeeperName={allTimeKeepers.find((tk) => tk.id === selectedTimeKeeper)?.name} />
                    <div id="module-holder" className="relative overflow-hidden flex-col flex-1">
                        <div className="h-full flex-1 overflow-y-scroll">
                            <CurrentTimeKeeperContext.Consumer>
                                {({ timeKeeperId }) => (
                                    <Switch>
                                        {timeKeeperId !== undefined && (
                                            <>
                                                <Route exact path={`${process.env.PUBLIC_URL}/list`}>
                                                    <PlayersList
                                                        onTimeRecord={(playerId) =>
                                                            dispatch(
                                                                add({
                                                                    playerId,
                                                                    timeKeeperId,
                                                                    time: new Date().getTime()
                                                                })
                                                            )
                                                        }
                                                        onTimeReset={(timeStampId) =>
                                                            dispatch(reset({ id: timeStampId }))
                                                        }
                                                        players={playersWithTimeStamps(timeKeeperId)}
                                                    />
                                                </Route>
                                                <Route exact path={`${process.env.PUBLIC_URL}/pad`}>
                                                    <PlayersDialPad
                                                        onPlayerCheckIn={(playerId) => {
                                                            dispatch(
                                                                add({
                                                                    playerId,
                                                                    timeKeeperId,
                                                                    time: new Date().getTime()
                                                                })
                                                            );
                                                        }}
                                                        title={"Clock in player"}
                                                        timeKeeperId={selectedTimeKeeper}
                                                    />
                                                </Route>
                                                <Route exact path={`${process.env.PUBLIC_URL}/times`}>
                                                    <PlayersTimes
                                                        onAddTime={() => {
                                                            dispatch(add({ timeKeeperId, time: new Date().getTime() }));
                                                        }}
                                                        times={timeStampsWithPlayers(timeKeeperId)}
                                                    />
                                                </Route>
                                            </>
                                        )}
                                    </Switch>
                                )}
                            </CurrentTimeKeeperContext.Consumer>
                        </div>
                    </div>
                    <div>
                        <StopWatchModeSwitch />
                    </div>
                </div>
            </Router>
        </CurrentTimeKeeperContext.Provider>
    );
}

export default App;
