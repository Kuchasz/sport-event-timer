import classNames from "classnames";

type Button = {
    char: string;
    desc?: string;
    changeNumber: (number: string) => string;
    shouldBeEnabled?: (number: string) => boolean;
};

const padActions = {
    addDigit: (digit: string) => (player: string) => player.concat(digit),
    back: (player: string) => player.slice(0, -1),
    reset: (_player: string) => "",
};

const buttons: Button[] = [
    { char: "1", changeNumber: padActions.addDigit("1") },
    { char: "2", desc: "abc", changeNumber: padActions.addDigit("2") },
    { char: "3", desc: "def", changeNumber: padActions.addDigit("3") },
    { char: "4", desc: "ghi", changeNumber: padActions.addDigit("4") },
    { char: "5", desc: "jkl", changeNumber: padActions.addDigit("5") },
    { char: "6", desc: "mno", changeNumber: padActions.addDigit("6") },
    { char: "7", desc: "pqrs", changeNumber: padActions.addDigit("7") },
    { char: "8", desc: "tuv", changeNumber: padActions.addDigit("8") },
    { char: "9", desc: "wxyz", changeNumber: padActions.addDigit("9") },
    { char: "↺", changeNumber: padActions.reset, shouldBeEnabled: () => true },
    { char: "0", changeNumber: padActions.addDigit("0") },
    { char: "←", changeNumber: padActions.back, shouldBeEnabled: number => number.length > 0 },
];

type PadButtonProps = {
    padClick: () => void;
    char: string;
    desc?: string;
    enabled: boolean;
    alwaysEnabled?: boolean;
};
const PadButton = ({ char, desc, padClick, enabled, alwaysEnabled }: PadButtonProps) => (
    <button
        onClick={padClick}
        disabled={!alwaysEnabled && !enabled}
        className="active:animate-pushIn m-1.5 cursor-pointer select-none rounded-md text-2xl font-semibold transition-opacity disabled:opacity-20">
        <div>{char}</div>
        <div className={classNames("text-2xs uppercase leading-none text-gray-400", { ["opacity-0"]: !desc })}>{desc ?? "&nbsp;"}</div>
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
        <div className="mb-2 mt-6 grid h-full w-5/6 grid-cols-3 grid-rows-4 self-center sm:w-1/3 xl:w-1/5">
            {buttons.map(b => (
                <PadButton
                    alwaysEnabled={b.shouldBeEnabled?.(props.number)}
                    enabled={props.availableDigits.includes(b.char)}
                    padClick={() => onPadButtonClick(b)}
                    char={b.char}
                    desc={b.desc}
                    key={b.char}
                />
            ))}
        </div>
    );
};
