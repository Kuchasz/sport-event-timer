import { mdiBackspaceOutline, mdiTimerPlusOutline } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { type ReactNode } from "react";

const padActions = {
    addDigit: (digit: string) => (player: string) => player.concat(digit),
    back: (player: string) => player.slice(0, -1),
    reset: (_player: string) => "",
};

type DigitButtonProps = {
    padClick: () => void;
    char: string;
    desc?: string;
    enabled: boolean;
};
const DigitButton = ({ char, desc, padClick, enabled }: DigitButtonProps) => (
    <button
        onClick={padClick}
        className={classNames(
            "active:animate-pushIn m-1.5 cursor-pointer select-none rounded-md text-2xl font-semibold transition-opacity",
            { ["pointer-events-none opacity-20"]: !enabled },
        )}>
        <div>{char}</div>
        <div className={classNames("text-2xs uppercase leading-none text-gray-400", { ["opacity-0"]: !desc })}>{desc ?? "&nbsp;"}</div>
    </button>
);

type IconButtonProps = {
    timeCritical?: boolean;
    buttonClick: () => void;
    enabled: boolean;
    children: ReactNode;
};
const IconButton = ({ timeCritical, children, buttonClick, enabled }: IconButtonProps) => (
    <button
        onPointerDown={timeCritical ? buttonClick : undefined}
        onClick={!timeCritical ? buttonClick : undefined}
        className={classNames(
            "active:animate-pushIn m-1.5 flex cursor-pointer select-none items-center justify-center rounded-md text-2xl font-semibold transition-opacity",
            { ["pointer-events-none opacity-20"]: !enabled },
        )}>
        {children}
    </button>
);

type DialPadProps = {
    onNumberChange: (number: string) => void;
    availableDigits: string[];
    number: string;
    canRecord: boolean;
    onRecord: () => void;
    timeCritical: boolean;
};
export const DialPad = (props: DialPadProps) => {
    return (
        <div className="mb-2 mt-6 grid h-full w-5/6 grid-cols-3 grid-rows-4 self-center sm:w-1/3 xl:w-1/5">
            <DigitButton
                enabled={props.availableDigits.includes("1")}
                padClick={() => props.onNumberChange(padActions.addDigit("1")(props.number))}
                char="1"
            />
            <DigitButton
                enabled={props.availableDigits.includes("2")}
                padClick={() => props.onNumberChange(padActions.addDigit("2")(props.number))}
                char="2"
                desc="abc"
            />
            <DigitButton
                enabled={props.availableDigits.includes("3")}
                padClick={() => props.onNumberChange(padActions.addDigit("3")(props.number))}
                char="3"
                desc="def"
            />
            <DigitButton
                enabled={props.availableDigits.includes("4")}
                padClick={() => props.onNumberChange(padActions.addDigit("4")(props.number))}
                char="4"
                desc="ghi"
            />
            <DigitButton
                enabled={props.availableDigits.includes("5")}
                padClick={() => props.onNumberChange(padActions.addDigit("5")(props.number))}
                char="5"
                desc="jkl"
            />
            <DigitButton
                enabled={props.availableDigits.includes("6")}
                padClick={() => props.onNumberChange(padActions.addDigit("6")(props.number))}
                char="6"
                desc="mno"
            />
            <DigitButton
                enabled={props.availableDigits.includes("7")}
                padClick={() => props.onNumberChange(padActions.addDigit("7")(props.number))}
                char="7"
                desc="pqrs"
            />
            <DigitButton
                enabled={props.availableDigits.includes("8")}
                padClick={() => props.onNumberChange(padActions.addDigit("8")(props.number))}
                char="8"
                desc="tuv"
            />
            <DigitButton
                enabled={props.availableDigits.includes("9")}
                padClick={() => props.onNumberChange(padActions.addDigit("9")(props.number))}
                char="9"
                desc="wxyz"
            />
            <IconButton enabled={props.canRecord} timeCritical={props.timeCritical} buttonClick={props.onRecord}>
                <div className="rounded-full bg-orange-500 p-2 text-white">
                    <Icon size={1} path={mdiTimerPlusOutline}></Icon>
                </div>
            </IconButton>
            <DigitButton
                enabled={props.availableDigits.includes("0")}
                padClick={() => props.onNumberChange(padActions.addDigit("0")(props.number))}
                char="0"
            />
            <IconButton enabled={props.number.length > 0} buttonClick={() => props.onNumberChange(padActions.back(props.number))}>
                <Icon size={1} path={mdiBackspaceOutline}></Icon>
            </IconButton>
        </div>
    );
};
