import { calculateStartTimes, readPlayersStartTimes } from "../api";
import { chooseTimeKeeper } from "@set/timer/dist/slices/user-config";
import { getConnection } from "../connection";
import { mdiUpload } from "@mdi/js";
import { PrimaryActionButton } from "./action-button";
import { TimeKeeperIcon } from "./time-keeper-icon";
import { useRef } from "react";
import { useTimerSelector } from "../hooks";

export const Config = ({ dispatch }: { dispatch: (action: any) => void }) => {
    const allTimeKeepers = useTimerSelector(x => x.timeKeepers);
    const inputFile = useRef<HTMLInputElement>(null);
    const timeKeeperId = useTimerSelector(x => x.userConfig?.timeKeeperId);

    const uploadPlayers = () => {
        inputFile?.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length === 1) {
            const [file] = e.target.files;
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                const socket = getConnection();
                socket.emit("upload-players", e.target?.result);
            };

            reader.readAsText(file);
        }
    };

    const handleReadPlayerStartTimes = () => {
        readPlayersStartTimes();
    };

    const handleCalculateTTStartTimes = () => {
        calculateStartTimes(false);
    };

    const handleCalculateAllStartTimes = () => {
        calculateStartTimes(true);
    };

    const setTimeKeeperId = (timeKeeperId: number) => {
        dispatch(chooseTimeKeeper({ timeKeeperId }));
    };

    return (
        <div className="flex h-full w-full items-center bg-zinc-800 flex-col">
            <input
                type="file"
                id="file"
                accept=".csv"
                onChange={handleFileChange}
                ref={inputFile}
                style={{ display: "none" }}
            />
            <div className="py-4">
                <PrimaryActionButton
                    onClick={uploadPlayers}
                    icon={mdiUpload}
                    contents={<strong>UPLOAD PLAYERS</strong>}
                />
            </div>
            <div className="py-4">
                <PrimaryActionButton
                    onClick={handleReadPlayerStartTimes}
                    icon={mdiUpload}
                    contents={<strong>READ PLAYER START TIMES</strong>}
                />
            </div>
            <div className="py-4">
                <PrimaryActionButton
                    onClick={handleCalculateTTStartTimes}
                    icon={mdiUpload}
                    contents={<strong>CALCULATE TT START TIMES</strong>}
                />
            </div>
            <div className="py-4">
                <PrimaryActionButton
                    onClick={handleCalculateAllStartTimes}
                    icon={mdiUpload}
                    contents={<strong>CALCULATE ALL START TIMES</strong>}
                />
            </div>
            <div className="flex flex-grow h-full w-full justify-center items-center bg-zinc-800 flex-col">
                {allTimeKeepers.map(tk => (
                    <button
                        onClick={() => setTimeKeeperId(tk.id)}
                        className={`flex items-center py-4 px-4 my-2 ${timeKeeperId === tk.id ? "" : "opacity-25"}`}
                        key={tk.id}
                    >
                        <TimeKeeperIcon type={tk.type} />
                        <span className="ml-4 text-xl">{tk.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
