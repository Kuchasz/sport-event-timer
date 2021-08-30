import { add, reset } from "@set/timer/slices/time-stamps";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CheckInPlayer } from "./components/check-in-player";
import {
    compose,
    equals,
    filter,
    last,
    length,
    map,
    splitAt,
    startsWith
    } from "ramda";
import { DialPad } from "./components/dial-pad";
import { PlayersGrid } from "./components/players-grid";
import { PlayersList } from "./components/players-list";
import { Status } from "./components/status";
import { StopWatchModeSwitch } from "./components/stopwatch-mode-switch";
import { Timer } from "./components/timer";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useState } from "react";

const getAvailablePlayers = (playerNumber: string, allPlayersNumbers: string[]) =>
    filter(
        compose(equals(1), length as () => number),
        map(last, map(splitAt(playerNumber.length), filter(startsWith(playerNumber), allPlayersNumbers)))
    ) as string[];

function App() {
    const [player, setPlayer] = useState("");
    const allPlayers = useAppSelector((x) => x.players);
    const allTimeStamps = useAppSelector((x) => x.timeStamps);
    const allPlayersNumbers = allPlayers.map((x) => x.number.toString());
    const dispatch = useAppDispatch();

    const playersWithTimesOnStart = allPlayers.map((x) => ({
        name: x.name,
        id: x.id,
        number: x.number,
        timeStamp: allTimeStamps.find((a) => a.playerId === x.id)
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
                                timeKeeperName="Start"
                                players={playersWithTimesOnStart}
                            />
                        </Route>
                        <Route exact path="/grid">
                            <PlayersGrid players={allPlayers} />
                        </Route>
                        <Route exact path="/pad">
                            <div>
                                <CheckInPlayer player={player} />
                                <DialPad
                                    availableDigits={getAvailablePlayers(player, allPlayersNumbers)}
                                    onPlayerChange={setPlayer}
                                />
                            </div>
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;
