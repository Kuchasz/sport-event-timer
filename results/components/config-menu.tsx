import Icon from "@mdi/react";
import { ClockSettings, TextActions } from "../pages/zegar";
import {
    mdiEyeOffOutline,
    mdiFormatFontSizeDecrease,
    mdiFormatFontSizeIncrease,
    mdiWindowClose
    } from "@mdi/js";

const ConfigButton = ({ text, path, click }: { text: string; path: string; click: () => void }) => (
    <span className="flex items-center py-2 cursor-pointer" onClick={click}>
        <div className="bg-orange-500 p-2 rounded-full text-white">
            <Icon size={1} path={path} />
        </div>
        <span className="ml-2">{text}</span>
    </span>
);

const ConfigMenuOption = ({
    actions,
    name,
    showDivider
}: {
    actions: TextActions;
    name: string;
    showDivider: boolean;
}) => (
    <div>
        <div className="flex flex-col p-2">
            {showDivider && (
                <div className="relative flex py-5 items-center">
                    <div className="grow border-t"></div>
                </div>
            )}
            <span>{name}</span>
            <ConfigButton click={actions.toggle} path={mdiEyeOffOutline} text="Ukryj" />
            <ConfigButton click={actions.enlargeFont} path={mdiFormatFontSizeIncrease} text="Powiększenie czcionki" />
            <ConfigButton click={actions.minifyFont} path={mdiFormatFontSizeDecrease} text="Pomniejszenie czcionki" />
        </div>
    </div>
);

export const ConfigMenu = ({
    clockState,
    setClockState,
    toggleMenu
}: {
    clockState: ClockSettings;
    setClockState: (state: ClockSettings) => void;
    toggleMenu: () => void;
}) => {
    const textActions = (prop: keyof Omit<ClockSettings, "showSettings">, step: number = 1): TextActions => ({
        enlargeFont: () => {
            const textState = clockState[prop];
            setClockState({ ...clockState, [prop]: { ...textState, size: textState.size + step } });
        },
        minifyFont: () => {
            const textState = clockState[prop];
            setClockState({ ...clockState, [prop]: { ...textState, size: textState.size - step } });
        },
        toggle: () => {
            const textState = clockState[prop];
            setClockState({ ...clockState, [prop]: { ...textState, enabled: !textState.enabled } });
        }
    });

    return (
        <div className="absolute left-0 top-0 h-full select-none">
            <div className="w-80 bg-zinc-100 h-full text-zinc-600 overflow-y-auto">
                <div className="flex p-2 items-center justify-between bg-orange-500 text-white text-2xl mb-4 font-medium">
                    Ustawienia
                    <div onClick={toggleMenu}>
                        <Icon className="cursor-pointer m-2" size={1} path={mdiWindowClose} />
                    </div>
                </div>
                <div>
                    <ConfigMenuOption actions={textActions("clock")} showDivider={false} name="Zegar" />
                    <ConfigMenuOption actions={textActions("countdown", 6)} showDivider={true} name="Stoper" />
                    <ConfigMenuOption actions={textActions("players")} showDivider={true} name="Zawodnicy" />
                </div>
            </div>
        </div>
    );
};
