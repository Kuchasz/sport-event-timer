import Icon from "@mdi/react";
import { Button } from "./button";
import { mdiCheck, mdiClose } from "@mdi/js";

type ConfirmationProps = {
    onReject: () => void;
    onResolve: (confirmed: boolean) => void;
    message: string;
};

export const Confirmation = ({ message, onReject, onResolve }: ConfirmationProps) => {
    return (
        <div className="flex flex-col">
            <div className="flex">
                <span>{message}</span>
            </div>
            <div className="mt-4 flex justify-between">
                <Button onClick={onReject} outline>
                    <Icon size={1} path={mdiClose} />
                    <span className="ml-2">Cancel</span>
                </Button>
                <Button onClick={() => onResolve(true)}>
                    <Icon size={1} path={mdiCheck} />
                    <span className="ml-2">OK</span>
                </Button>
            </div>
        </div>
    );
};
