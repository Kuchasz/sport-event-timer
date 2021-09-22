import { add, reset } from "@set/timer/slices/time-stamps";
import { BottomMenu } from "./components/bottom-menu";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch
    } from "react-router-dom";
import { Config } from "./components/config";
import { CurrentTimeKeeperContext } from "./contexts/current-time-keeper";
import { PlayersDialPad } from "./components/players-dial-pad";
import { PlayersList } from "./components/players-list";
import { PlayersTimes } from "./components/players-times";
import { Status } from "./components/status";
import { TimeOffsetContext } from "./contexts/time-offset";
import { useState } from "react";
import { useTimerDispatch, useTimerSelector } from "./hooks";

const getCurrentTime = (offset: number) => Date.now() + offset;

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
                            <TimeOffsetContext.Consumer>
                                {({ offset }) => (
                                    <CurrentTimeKeeperContext.Consumer>
                                        {({ timeKeeperId }) => (
                                            <Switch>
                                                <Route exact path={`${process.env.PUBLIC_URL}/`}>
                                                    <Redirect to={`${process.env.PUBLIC_URL}/config`} />
                                                </Route>
                                                <Route exact path={`${process.env.PUBLIC_URL}/config`}>
                                                    <Config></Config>
                                                </Route>
                                                {timeKeeperId !== undefined && (
                                                    <>
                                                        <Route exact path={`${process.env.PUBLIC_URL}/list`}>
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
                                                                            time: getCurrentTime(offset)
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
                                                                    dispatch(
                                                                        add({
                                                                            timeKeeperId,
                                                                            time: getCurrentTime(offset)
                                                                        })
                                                                    );
                                                                }}
                                                                times={timeStampsWithPlayers(timeKeeperId)}
                                                            />
                                                        </Route>
                                                    </>
                                                )}
                                            </Switch>
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
