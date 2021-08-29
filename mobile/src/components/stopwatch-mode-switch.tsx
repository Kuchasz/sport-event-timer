import { StopWatchMode } from "../stopwatch-mode"

const StopWatchModeSwitchButton = ({text, onClick}: {text: string, onClick: () => void}) => <div onClick={onClick} className="bg-gray-700 rounded-md px-4 py-2 mr-4">{text}</div>

type StopWatchModeSwitchProps = {
    mode: StopWatchMode;
    onModeChange: (mode: StopWatchMode) => void;
}

export const StopWatchModeSwitch = ({mode, onModeChange}: StopWatchModeSwitchProps) => <div className="flex mt-5">
    <StopWatchModeSwitchButton onClick={() => onModeChange('list')} text="List"/>
    <StopWatchModeSwitchButton onClick={() => onModeChange('grid')} text="Grid"/>
    <StopWatchModeSwitchButton onClick={() => onModeChange('pad')} text="Pad"/>
</div>