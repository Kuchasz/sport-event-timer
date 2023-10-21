import Icon from "@mdi/react";
import { mdiEyeOffOutline, mdiEyeOutline, mdiFormatFontSizeDecrease, mdiFormatFontSizeIncrease, mdiWindowClose } from "@mdi/js";
import { TextActions, TextSettings } from "../../app/[locale]/(timer)/timer/[raceId]/timer";
import { TimerSettings } from "states/timer-states";

const ConfigButton = ({ text, path, click }: { text: string; path: string; click: () => void }) => (
    <span className="flex cursor-pointer items-center py-2" onClick={click}>
        <div className="rounded-full bg-orange-500 p-2 text-white">
            <Icon size={0.8} path={path} />
        </div>
        <span className="ml-2">{text}</span>
    </span>
);

const ConfigMenuOption = ({
    actions,
    name,
    settings,
    showDivider,
}: {
    actions: TextActions;
    name: string;
    settings: TextSettings;
    showDivider: boolean;
}) => (
    <div>
        <div className="flex flex-col p-2">
            {showDivider && (
                <div className="relative flex items-center py-5">
                    <div className="grow border-t"></div>
                </div>
            )}
            <span>{name}</span>
            <ConfigButton
                click={actions.toggle}
                path={settings.enabled ? mdiEyeOffOutline : mdiEyeOutline}
                text={settings.enabled ? "Ukryj" : "Pokaż"}
            />
            <ConfigButton click={actions.enlargeFont} path={mdiFormatFontSizeIncrease} text="Powiększenie czcionki" />
            <ConfigButton click={actions.minifyFont} path={mdiFormatFontSizeDecrease} text="Pomniejszenie czcionki" />
        </div>
    </div>
);

export const ConfigMenu = ({
    clockState,
    setClockState,
    toggleMenu,
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
        },
    });

    return (
        <div className="absolute left-0 top-0 h-full select-none">
            <div className="flex h-full w-80 flex-col overflow-y-hidden bg-zinc-100 text-zinc-600">
                <div className="flex items-center justify-between bg-orange-500 p-2 text-2xl font-medium text-white">
                    Ustawienia
                    <div onClick={toggleMenu}>
                        <Icon className="m-2 cursor-pointer" size={0.8} path={mdiWindowClose} />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <ConfigMenuOption settings={clockState["clock"]} actions={textActions("clock")} showDivider={false} name="Zegar" />
                    <ConfigMenuOption
                        settings={clockState["countdown"]}
                        actions={textActions("countdown", 6)}
                        showDivider={true}
                        name="Stoper"
                    />
                    <ConfigMenuOption
                        settings={clockState["currentPlayer"]}
                        actions={textActions("currentPlayer", 6)}
                        showDivider={true}
                        name="Aktualny zawodnik"
                    />
                    <ConfigMenuOption
                        settings={clockState["nextPlayers"]}
                        actions={textActions("nextPlayers")}
                        showDivider={true}
                        name="Następni zawodnicy"
                    />
                    <ConfigMenuOption
                        settings={clockState["players"]}
                        actions={textActions("players")}
                        showDivider={true}
                        name="Lista zawodników"
                    />
                </div>
            </div>
        </div>
    );
};
