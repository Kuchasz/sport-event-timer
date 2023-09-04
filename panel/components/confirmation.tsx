import { Button } from "./button";

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
                    Cancel
                </Button>
                <Button onClick={() => onResolve(true)}>OK</Button>
            </div>
        </div>
    );
};
