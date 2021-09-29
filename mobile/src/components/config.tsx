import { CurrentTimeKeeperContext } from "../contexts/current-time-keeper";
import { mdiUpload } from "@mdi/js";
import { PrimaryActionButton } from "./action-button";
import { socket } from "../connection";
import { TimeKeeperIcon } from "./time-keeper-icon";
import { useRef } from "react";
import { useTimerSelector } from "../hooks";

export const Config = () => {
    const allTimeKeepers = useTimerSelector((x) => x.timeKeepers);
    const inputFile = useRef<HTMLInputElement>(null);

    const onButtonClick = () => {
        inputFile?.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length === 1) {
            const [file] = e.target.files;
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                socket.emit("upload-players", e.target?.result);
            };

            reader.readAsText(file);
        }
    };

    return (
        <CurrentTimeKeeperContext.Consumer>
            {({ setTimeKeeperId }) => (
                <div className="flex h-full w-full justify-center items-center bg-gray-800 flex-col">
                    <input
                        type="file"
                        id="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        ref={inputFile}
                        style={{ display: "none" }}
                    />
                    <PrimaryActionButton
                        onClick={onButtonClick}
                        icon={mdiUpload}
                        contents={<strong>UPLOAD PLAYERS</strong>}
                    />
                    {allTimeKeepers.map((tk) => (
                        <button
                            onClick={() => setTimeKeeperId(tk.id)}
                            className="flex items-center py-4 px-4 my-2"
                            key={tk.id}
                        >
                            <TimeKeeperIcon type={tk.type} />
                            <span className="ml-4 text-xl">{tk.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </CurrentTimeKeeperContext.Consumer>
    );
};
