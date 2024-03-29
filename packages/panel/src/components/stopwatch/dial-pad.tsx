import { mdiBackspaceOutline } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { useState, type ReactNode } from "react";

const padActions = {
    addDigit: (digit: string) => (player: string) => player.concat(digit),
    back: (player: string) => player.slice(0, -1),
    reset: (_player: string) => "",
};

type DigitButtonProps = {
    padClick: () => void;
    char: string;
    desc?: string;
};
const DigitButton = ({ char, desc, padClick }: DigitButtonProps) => {
    const [animation, setAnimation] = useState(false);

    return (
        <button
            onPointerDown={() => {
                if (animation) {
                    setAnimation(false);
                    setTimeout(() => {
                        setAnimation(true);
                    });
                } else {
                    setAnimation(true);
                }
                padClick();
            }}
            className="cursor-pointer select-none p-1.5 text-2xl font-semibold">
            <div className={classNames(animation ? "animate-pushIn" : "")} onAnimationEnd={() => setAnimation(false)}>
                {char}
            </div>
            <div
                className={classNames("text-2xs uppercase leading-none text-gray-400", {
                    ["opacity-0"]: !desc,
                    ["animate-pushIn"]: animation,
                })}>
                {desc ?? "&nbsp;"}
            </div>
        </button>
    );
};

type IconButtonProps = {
    timeCritical?: boolean;
    buttonClick: () => void;
    enabled: boolean;
    children: ReactNode;
};
const IconButton = ({ timeCritical, children, buttonClick, enabled }: IconButtonProps) => {
    const [animation, setAnimation] = useState(false);
    const handleClick = () => {
        setAnimation(true);
        buttonClick();
    };
    return (
        <button
            onPointerDown={timeCritical ? handleClick : undefined}
            onClick={!timeCritical ? handleClick : undefined}
            onAnimationEnd={() => setAnimation(false)}
            className={classNames(
                "mb-2.5 flex cursor-pointer select-none items-center justify-center rounded-md text-2xl font-semibold transition-opacity",
                { ["animate-pushIn"]: animation },
                { ["pointer-events-none opacity-20"]: !enabled },
            )}>
            {children}
        </button>
    );
};

type DialPadProps = {
    onNumberChange: (number: string) => void;
    number: string;
    canRecord: boolean;
    onRecord: () => void;
    timeCritical: boolean;
};
export const DialPad = (props: DialPadProps) => {
    return (
        <div className="mt-6 grid h-full w-5/6 grid-cols-3 grid-rows-4 self-center sm:w-1/3 xl:w-1/5">
            <DigitButton padClick={() => props.onNumberChange(padActions.addDigit("1")(props.number))} char="1" />
            <DigitButton padClick={() => props.onNumberChange(padActions.addDigit("2")(props.number))} char="2" desc="abc" />
            <DigitButton padClick={() => props.onNumberChange(padActions.addDigit("3")(props.number))} char="3" desc="def" />
            <DigitButton padClick={() => props.onNumberChange(padActions.addDigit("4")(props.number))} char="4" desc="ghi" />
            <DigitButton padClick={() => props.onNumberChange(padActions.addDigit("5")(props.number))} char="5" desc="jkl" />
            <DigitButton padClick={() => props.onNumberChange(padActions.addDigit("6")(props.number))} char="6" desc="mno" />
            <DigitButton padClick={() => props.onNumberChange(padActions.addDigit("7")(props.number))} char="7" desc="pqrs" />
            <DigitButton padClick={() => props.onNumberChange(padActions.addDigit("8")(props.number))} char="8" desc="tuv" />
            <DigitButton padClick={() => props.onNumberChange(padActions.addDigit("9")(props.number))} char="9" desc="wxyz" />
            <DigitButton padClick={() => {}} char="" desc="" />
            <DigitButton padClick={() => props.onNumberChange(padActions.addDigit("0")(props.number))} char="0" />
            <IconButton enabled={props.number.length > 0} buttonClick={() => props.onNumberChange(padActions.back(props.number))}>
                <Icon size={1} path={mdiBackspaceOutline}></Icon>
            </IconButton>
        </div>
    );
};
