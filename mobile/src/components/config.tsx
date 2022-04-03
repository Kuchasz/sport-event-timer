import { chooseTimeKeeper } from "@set/timer/dist/slices/user-config";
import { getConnection } from "../connection";
import { mdiUpload } from "@mdi/js";
import { PrimaryActionButton } from "./action-button";
import { TimeKeeperIcon } from "./time-keeper-icon";
import { useRef } from "react";
import { useTimerSelector } from "../hooks";

export const Config = ({ dispatch }: { dispatch: (action: any) => void }) => {
    const allTimeKeepers = useTimerSelector((x) => x.timeKeepers);
    const inputFile = useRef<HTMLInputElement>(null);
    const timeKeeperId = useTimerSelector((x) => x.userConfig?.timeKeeperId);

    const onButtonClick = () => {
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

    const setTimeKeeperId = (timeKeeperId: number) => {
        dispatch(chooseTimeKeeper({ timeKeeperId }));
    };

    return (
        <div className="flex h-full w-full justify-center items-center bg-zinc-800 flex-col">
            <input
                type="file"
                id="file"
                accept=".csv"
                onChange={handleFileChange}
                ref={inputFile}
                style={{ display: "none" }}
            />
            <PrimaryActionButton onClick={onButtonClick} icon={mdiUpload} contents={<strong>UPLOAD PLAYERS</strong>} />
            {allTimeKeepers.map((tk) => (
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
    );
};
