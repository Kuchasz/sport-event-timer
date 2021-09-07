import React from "react";

type Button = {
    char: string;
    changeNumber: (number: string) => string;
    alwaysEnabled?: boolean;
};

const padActions = {
    addDigit: (digit: string) => (player: string) => player.concat(digit),
    back: (player: string) => player.slice(0, -1),
    reset: (player: string) => ""
};

const buttons: Button[] = [
    { char: "1", changeNumber: padActions.addDigit("1") },
    { char: "2", changeNumber: padActions.addDigit("2") },
    { char: "3", changeNumber: padActions.addDigit("3") },
    { char: "4", changeNumber: padActions.addDigit("4") },
    { char: "5", changeNumber: padActions.addDigit("5") },
    { char: "6", changeNumber: padActions.addDigit("6") },
    { char: "7", changeNumber: padActions.addDigit("7") },
    { char: "8", changeNumber: padActions.addDigit("8") },
    { char: "9", changeNumber: padActions.addDigit("9") },
    { char: "↺", changeNumber: padActions.reset, alwaysEnabled: true },
    { char: "0", changeNumber: padActions.addDigit("0") },
    { char: "←", changeNumber: padActions.back, alwaysEnabled: true }
];

type PadButtonProps = {
    padClick: () => void;
    char: string;
    enabled: boolean;
    alwaysEnabled?: boolean;
};
const PadButton = ({ char, padClick, enabled, alwaysEnabled }: PadButtonProps) => (
    // alwaysEnabled || enabled ? (
    <button
        onClick={padClick}
        disabled={!alwaysEnabled && !enabled}
        className="disabled:opacity-20 border-gray-600 font-medium border-dashed text-2xl transition-opacity rounded-md text-gray-800 m-1.5 "
    >
        {char}
    </button>
);
// ) : (
//     <p className="flex items-center justify-center font-medium text-gray-400 text-2xl m-1.5">{char}</p>
// );

type DialPadProps = {
    onNumberChange: (number: string) => void;
    availableDigits: string[];
    number: string;
};
export const DialPad = (props: DialPadProps) => {
    const onPadButtonClick = (button: Button) => {
        const newNumber = button.changeNumber(props.number);
        props.onNumberChange(newNumber);
    };

    return (
        <div className="grid h-3/5 flex-auto grid-cols-3 grid-rows-4">
            {buttons.map((b) => (
                <PadButton
                    alwaysEnabled={b.alwaysEnabled}
                    enabled={props.availableDigits.includes(b.char)}
                    padClick={() => onPadButtonClick(b)}
                    char={b.char}
                    key={b.char}
                />
            ))}
        </div>
    );
};
