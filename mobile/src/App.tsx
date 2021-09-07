import { add, reset } from "@set/timer/slices/time-stamps";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PlayersDialPad } from "./components/players-dial-pad";
import { PlayersGrid } from "./components/players-grid";
import { PlayersList } from "./components/players-list";
import { PlayersTimes } from "./components/players-times";
import { Status } from "./components/status";
import { StopWatchModeSwitch } from "./components/stopwatch-mode-switch";
import { useAppDispatch, useAppSelector } from "./hooks";

function App() {
    const allPlayers = useAppSelector((x) => x.players);
    const allTimeStamps = useAppSelector((x) => x.timeStamps);
    const allTimeKeepers = useAppSelector((x) => x.timeKeepers);

    const dispatch = useAppDispatch();

    const playersWithTimeStamps = allPlayers.map((x) => ({
        ...x,
        timeStamp: allTimeStamps.find((a) => a.playerId === x.id)
    }));

    const timeStampsWithPlayers = allTimeStamps.map((s) => ({
        ...s,
        player: allPlayers.find((p) => s.playerId === p.id)
    }));

    return (
        <Router basename={process.env.PUBLIC_URL}>
            <div className="bg-orange-100 flex flex-col overflow-hidden h-full w-screen text-white">
                <Status timeKeeperName="Start" />
                <div id="module-holder" className="relative overflow-hidden flex-col flex-1">
                    <div className="px-5 h-full flex-1 overflow-y-scroll">
                        <Switch>
                            <Route exact path="list">
                                <PlayersList
                                    onTimeRecord={(playerId) =>
                                        dispatch(add({ playerId, timeKeeperId: 0, time: new Date().getTime() }))
                                    }
                                    onTimeReset={(timeStampId) => dispatch(reset({ id: timeStampId }))}
                                    timeKeeperName={allTimeKeepers[0].name}
                                    players={playersWithTimeStamps}
                                />
                            </Route>
                            <Route exact path="grid">
                                <PlayersGrid players={allPlayers} />
                            </Route>
                            <Route exact path="pad">
                                <PlayersDialPad
                                    onPlayerCheckIn={(playerId) => {
                                        dispatch(add({ playerId, timeKeeperId: 0, time: new Date().getTime() }));
                                    }}
                                />
                            </Route>
                            <Route exact path="times">
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
