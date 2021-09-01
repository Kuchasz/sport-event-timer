import { add, reset } from "@set/timer/slices/time-stamps";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CheckInPlayer } from "./components/check-in-player";
import { DialPad } from "./components/dial-pad";
import { getAvailableDigits } from "./utils";
import { PlayersGrid } from "./components/players-grid";
import { PlayersList } from "./components/players-list";
import { PlayersTimes } from "./components/players-times";
import { Status } from "./components/status";
import { StopWatchModeSwitch } from "./components/stopwatch-mode-switch";
import { Timer } from "./components/timer";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useState } from "react";

function App() {
    const [playerNumber, setPlayerNumber] = useState("");
    const allPlayers = useAppSelector((x) => x.players);
    const allTimeStamps = useAppSelector((x) => x.timeStamps);
    const allTimeKeepers = useAppSelector((x) => x.timeKeepers);

    const dispatch = useAppDispatch();

    const playersWithTimeStamps = allPlayers.map((x) => ({
        ...x,
        timeStamp: allTimeStamps.find((a) => a.playerId === x.id)
    }));

    const playersWithoutTimeStamps = playersWithTimeStamps.filter((x) => x.timeStamp === undefined);
    const playersNumbersWithoutTimeStamps = playersWithoutTimeStamps.map((x) => x.number.toString());

    const timeStampsWithPlayers = allTimeStamps.map((s) => ({
        ...s,
        player: allPlayers.find((p) => s.playerId === p.id)
    }));

    return (
        <Router>
            <div className="bg-orange-100 flex flex-col h-screen w-screen text-white">
                <Status timeKeeperName="Start" />
                <div className="flex flex-col justify-center px-10 py-5 bg-gray-600">
                    <Timer />
                    <StopWatchModeSwitch mode={"list"} />
                </div>
                <div className="px-20 flex-grow overflow-y-auto">
                    <Switch>
                        <Route exact path="/list">
                            <PlayersList
                                onTimeRecord={(playerId) =>
                                    dispatch(add({ playerId, timeKeeperId: 0, time: new Date().getTime() }))
                                }
                                onTimeReset={(timeStampId) => dispatch(reset({ id: timeStampId }))}
                                timeKeeperName={allTimeKeepers[0].name}
                                players={playersWithTimeStamps}
                            />
                        </Route>
                        <Route exact path="/grid">
                            <PlayersGrid players={allPlayers} />
                        </Route>
                        <Route exact path="/pad">
                            <div className="flex flex-col">
                                <CheckInPlayer
                                    onPlayerCheckIn={(playerId) => {
                                        dispatch(add({ playerId, timeKeeperId: 0, time: new Date().getTime() }));
                                        setPlayerNumber("");
                                    }}
                                    playerNumber={playerNumber}
                                    player={playersWithoutTimeStamps.find((p) => p.number === parseInt(playerNumber))}
                                />
                                <DialPad
                                    availableDigits={getAvailableDigits(playerNumber, playersNumbersWithoutTimeStamps)}
                                    number={playerNumber}
                                    onNumberChange={setPlayerNumber}
                                />
                            </div>
                        </Route>
                        <Route exact path="/times">
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
        </Router>
    );
}

export default App;
