import { allPlayers } from "./player";
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
import { useState } from "react";

const allPlayersNumbers = allPlayers.map(x => x.number.toString());

const getAvailablePlayers = (playerNumber: string) =>
    filter(
        compose(equals(1), length as () => number),
        map(last, map(splitAt(playerNumber.length), filter(startsWith(playerNumber), allPlayersNumbers)))
    ) as string[];

function App() {
    const [player, setPlayer] = useState("");
    // const [stopWatchMode, setStopWatchMode] = useState<StopWatchMode>("list");

    return (
        <Router>
            <div className="bg-orange-100 flex flex-col h-screen w-screen text-white">
                <Status measurementPoint="Start" />
                <div className="flex flex-col justify-center px-10 py-5 bg-gray-600">
                    <Timer />
                    <StopWatchModeSwitch mode={"list"} />
                </div>

                <div className="px-20 flex-grow overflow-y-auto">
                    <Switch>
                        <Route exact path="/list">
                            <PlayersList measurementPoint="Start" players={allPlayers} />
                        </Route>
                        <Route exact path="/grid">
                            <PlayersGrid players={allPlayers} />
                        </Route>
                        <Route exact path="/pad">
                            <div>
                                <CheckInPlayer player={player} />
                                <DialPad availableDigits={getAvailablePlayers(player)} onPlayerChange={setPlayer} />
                            </div>
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;
