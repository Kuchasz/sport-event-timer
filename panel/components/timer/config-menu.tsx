import Icon from "@mdi/react";
import {
    mdiEyeOffOutline,
    mdiEyeOutline,
    mdiFormatFontSizeDecrease,
    mdiFormatFontSizeIncrease,
    mdiWindowClose
    } from "@mdi/js";
import { TextActions, TextSettings } from "../../pages/timer/[raceId]";
import { TimerSettings } from "states/timer-states";

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
    settings,
    showDivider
}: {
    actions: TextActions;
    name: string;
    settings: TextSettings;
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
            <ConfigButton click={actions.toggle} path={settings.enabled ? mdiEyeOffOutline : mdiEyeOutline} text={settings.enabled ? "Ukryj" : 'Pokaż'} />
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
    clockState: TimerSettings;
    setClockState: (state: TimerSettings) => void;
    toggleMenu: () => void;
}) => {
    const textActions = (prop: keyof Omit<TimerSettings, "showSettings">, step: number = 1): TextActions => ({
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
            <div className="w-80 bg-zinc-100 h-full flex flex-col text-zinc-600 overflow-y-hidden">
                <div className="flex p-2 items-center justify-between bg-orange-500 text-white text-2xl font-medium">
                    Ustawienia
                    <div onClick={toggleMenu}>
                        <Icon className="cursor-pointer m-2" size={1} path={mdiWindowClose} />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <ConfigMenuOption settings={clockState["clock"]} actions={textActions("clock")} showDivider={false} name="Zegar" />
                    <ConfigMenuOption settings={clockState['countdown']} actions={textActions("countdown", 6)} showDivider={true} name="Stoper" />
                    <ConfigMenuOption settings={clockState['currentPlayer']} actions={textActions("currentPlayer", 6)} showDivider={true} name="Aktualny zawodnik" />
                    <ConfigMenuOption settings={clockState['nextPlayers']} actions={textActions("nextPlayers")} showDivider={true} name="Następni zawodnicy" />
                    <ConfigMenuOption settings={clockState['players']} actions={textActions("players")} showDivider={true} name="Lista zawodników" />
                </div>
            </div>
        </div>
    );
};