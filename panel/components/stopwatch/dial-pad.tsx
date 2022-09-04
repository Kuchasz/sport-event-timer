type Button = {
    char: string;
    changeNumber: (number: string) => string;
    alwaysEnabled?: boolean;
};

const padActions = {
    addDigit: (digit: string) => (player: string) => player.concat(digit),
    back: (player: string) => player.slice(0, -1),
    reset: (_player: string) => ""
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
    <button
        onClick={padClick}
        disabled={!alwaysEnabled && !enabled}
        className="select-none active:animate-pushIn cursor-pointer disabled:opacity-20 text-2xl transition-opacity rounded-md m-1.5 "
    >
        {char}
    </button>
);

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
        <div className="grid h-2/5 self-center w-5/6 sm:w-1/3 xl:w-1/5 grid-cols-3 py-2 grid-rows-4">
            {buttons.map(b => (
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
