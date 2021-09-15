import { add, reset } from "@set/timer/slices/time-stamps";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PlayersDialPad } from "./components/players-dial-pad";
import { PlayersList } from "./components/players-list";
import { PlayersTimes } from "./components/players-times";
import { Status } from "./components/status";
import { StopWatchModeSwitch } from "./components/stopwatch-mode-switch";
import { useTimerDispatch, useTimerSelector } from "./hooks";
function App() {
    const allPlayers = useTimerSelector((x) => x.players);
    const allTimeStamps = useTimerSelector((x) => x.timeStamps);
    const allTimeKeepers = useTimerSelector((x) => x.timeKeepers);

    const dispatch = useTimerDispatch();

    const playersWithTimeStamps = allPlayers.map((x) => ({
        ...x,
        timeStamp: allTimeStamps.find((a) => a.playerId === x.id)
    }));

    const timeStampsWithPlayers = allTimeStamps.map((s) => ({
        ...s,
        player: allPlayers.find((p) => s.playerId === p.id)
    }));

    return (
        <Router>
            <div className="flex flex-col overflow-hidden bg-gray-800 h-full w-screen text-white">
                <Status timeKeeperName="Start" />
                <div id="module-holder" className="relative overflow-hidden flex-col flex-1">
                    <div className="h-full flex-1 overflow-y-scroll">
                        <Switch>
                            <Route exact path={`${process.env.PUBLIC_URL}/list`}>
                                <PlayersList
                                    onTimeRecord={(playerId) =>
                                        dispatch(add({ playerId, timeKeeperId: 0, time: new Date().getTime() }))
                                    }
                                    onTimeReset={(timeStampId) => dispatch(reset({ id: timeStampId }))}
                                    timeKeeperName={allTimeKeepers[0].name}
                                    players={playersWithTimeStamps}
                                />
                            </Route>
                            <Route exact path={`${process.env.PUBLIC_URL}/pad`}>
                                <PlayersDialPad
                                    onPlayerCheckIn={(playerId) => {
                                        dispatch(add({ playerId, timeKeeperId: 0, time: new Date().getTime() }));
                                    }}
                                />
                            </Route>
                            <Route exact path={`${process.env.PUBLIC_URL}/times`}>
                                <PlayersTimes
                                    onAddTime={() => {
                                        dispatch(add({ timeKeeperId: 0, time: new Date().getTime() }));
                                    }}
                                    times={timeStampsWithPlayers}
                                />
                            </Route>
                        </Switch>
                    </div>
                </div>
                <div>
                    <StopWatchModeSwitch />
                </div>
            </div>
        </Router>
    );
}

export default App;
