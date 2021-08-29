import { DialPad } from "./components/dial-pad";
import { Timer } from "./components/timer";
import { CheckInPlayer } from "./components/check-in-player";
import { useState } from "react";
import { Status } from "./components/status";
import { map, filter, startsWith, splitAt, compose, last, equals, length } from "ramda";
import { StopWatchModeSwitch } from "./components/stopwatch-mode-switch";
import { allPlayers } from "./player";
import { PlayersGrid } from "./components/players-grid";
import { PlayersList } from "./components/players-list";
import { StopWatchMode } from "./stopwatch-mode";

const allPlayersNumbers = allPlayers.map((x) => x.number.toString());

const getAvailablePlayers = (playerNumber: string) =>
    filter(
        compose(equals(1), length as () => number),
        map(last, map(splitAt(playerNumber.length), filter(startsWith(playerNumber), allPlayersNumbers)))
    ) as string[];

function App() {
    const [player, setPlayer] = useState("");
    const [stopWatchMode, setStopWatchMode] = useState<StopWatchMode>("list");

    return (
        <div className="bg-orange-100 flex flex-col h-screen w-screen text-white">
            <Status measurementPoint="Start" />
            <div className="flex flex-col justify-center px-10 py-5 bg-gray-600">
                <Timer />
                <StopWatchModeSwitch onModeChange={setStopWatchMode} mode={stopWatchMode} />
            </div>
            <div className="px-20 flex-grow overflow-y-auto">
                {stopWatchMode === "list" && <PlayersList measurementPoint="Start" players={allPlayers} />}
                {stopWatchMode === "grid" && <PlayersGrid players={allPlayers} />}
                {stopWatchMode === "pad" && (
                    <div>
                        <CheckInPlayer player={player} />
                        <DialPad availableDigits={getAvailablePlayers(player)} onPlayerChange={setPlayer} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
