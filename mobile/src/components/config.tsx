import {
    assignPlayerNumbers,
    calculateGCStartTimes,
    calculateNonGCStartTimes,
    readPlayersStartTimes,
    stripLists,
    uploadPlayers
    } from "../api";
import { chooseTimeKeeper } from "@set/timer/dist/slices/user-config";
import { mdiUpload } from "@mdi/js";
import { PrimaryActionButton } from "./action-button";
import { TimeKeeperIcon } from "./time-keeper-icon";
import { useRef, useState } from "react";
import { useTimerSelector } from "../hooks";

export const Config = ({ dispatch }: { dispatch: (action: any) => void }) => {
    const allTimeKeepers = useTimerSelector(x => x.timeKeepers);
    const inputFile = useRef<HTMLInputElement>(null);
    const timeKeeperId = useTimerSelector(x => x.userConfig?.timeKeeperId);
    const [devModeEnabled, setDevModeEnabled] = useState<boolean>(false);
    const [devModeClicks, setDevModeClicks] = useState<number>(0);

    const triggerPlayersFileChooser = () => {
        inputFile?.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length === 1) {
            const [file] = e.target.files;
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                uploadPlayers(e.target!.result! as string);
            };

            reader.readAsText(file);
        }
    };

    const handleAssignPlayerNumbers = async () => {
        const res = await assignPlayerNumbers();
        console.log(res);
    };

    const handleReadPlayerStartTimes = () => {
        readPlayersStartTimes();
    };

    const handleCalculateNonGCStartTimes = () => {
        calculateNonGCStartTimes();
    };

    const handleCalculateGCStartTimes = () => {
        calculateGCStartTimes();
    };

    const handleStripLists = () => {
        stripLists();
    };

    const setTimeKeeperId = (timeKeeperId: number) => {
        dispatch(chooseTimeKeeper({ timeKeeperId }));
    };

    const onHiddenClick = () => {
        if (devModeClicks === 10) {
            setDevModeEnabled(true);
        } else {
            setDevModeClicks(devModeClicks + 1);
        }
    };

    return (
        <div className="flex h-full w-full items-center bg-zinc-800 flex-col">
            <div onClick={onHiddenClick} className="w-24 h-24 absolute t-0 r-0 self-end"></div>

            {devModeEnabled ? (
                <div>
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
                            onClick={triggerPlayersFileChooser}
                            icon={mdiUpload}
                            contents={<strong>UPLOAD PLAYERS</strong>}
                        />
                    </div>
                    <div className="py-4">
                        <PrimaryActionButton
                            onClick={handleAssignPlayerNumbers}
                            icon={mdiUpload}
                            contents={<strong>ASSIGN PLAYERS NUMBERS</strong>}
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
                            onClick={handleCalculateNonGCStartTimes}
                            icon={mdiUpload}
                            contents={<strong>CALCULATE NON GC START TIMES</strong>}
                        />
                    </div>
                    <div className="py-4">
                        <PrimaryActionButton
                            onClick={handleCalculateGCStartTimes}
                            icon={mdiUpload}
                            contents={<strong>CALCULATE GC START TIMES</strong>}
                        />
                    </div>
                    <div className="py-4">
                        <PrimaryActionButton
                            onClick={handleStripLists}
                            icon={mdiUpload}
                            contents={<strong>STRIP LISTS FOR TIMEGONEW</strong>}
                        />
                    </div>
                </div>
            ) : null}

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
