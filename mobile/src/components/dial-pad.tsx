import React from "react";

type Button = {
    char: string;
    action: (number: string) => string;
    alwaysEnabled?: boolean;
};

const padActions = {
    addDigit: (digit: string) => (player: string) => player.concat(digit),
    back: (player: string) => player.slice(0, -1),
    reset: (player: string) => "",
};

const buttons: Button[] = [
    { char: "1", action: padActions.addDigit("1") },
    { char: "2", action: padActions.addDigit("2") },
    { char: "3", action: padActions.addDigit("3") },
    { char: "4", action: padActions.addDigit("4") },
    { char: "5", action: padActions.addDigit("5") },
    { char: "6", action: padActions.addDigit("6") },
    { char: "7", action: padActions.addDigit("7") },
    { char: "8", action: padActions.addDigit("8") },
    { char: "9", action: padActions.addDigit("9") },
    { char: "↺", action: padActions.reset, alwaysEnabled: true },
    { char: "0", action: padActions.addDigit("0") },
    { char: "←", action: padActions.back, alwaysEnabled: true },
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
        className="disabled:opacity-50 px-10 py-3 rounded-md bg-gray-600 hover:bg-orange-500 font-white m-1.5"
    >
        {char}
    </button>
);

type DialPadProps = {
    onPlayerChange: (number: string) => void;
    availableDigits: string[];
};
type DialPadState = { player: string };
export class DialPad extends React.Component<DialPadProps, DialPadState> {
    state = { player: "" };

    onPadButtonClick = (button: Button) => {
        this.setState(
            (state) => ({ player: button.action(state.player) }),
            () => this.props.onPlayerChange(this.state.player)
        );
    };

    render() {
        return (
            <div className="grid grid-cols-3 grid-rows-3">
                {buttons.map((b) => (
                    <PadButton
                        alwaysEnabled={b.alwaysEnabled}
                        enabled={this.props.availableDigits.includes(b.char)}
                        padClick={() => this.onPadButtonClick(b)}
                        char={b.char}
                        key={b.char}
                    />
                ))}
            </div>
        );
    }
}
