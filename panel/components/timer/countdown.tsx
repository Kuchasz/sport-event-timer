import classNames from "classnames";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";
import { formatSecondsToTimeSpan } from "utils";

const secondsToPlay = [0, 1, 2, 3, 4, 5];

const useSize = <T extends HTMLElement,>(target: RefObject<T>) => {
    const [size, setSize] = useState<DOMRect>()
  
    useLayoutEffect(() => {
      setSize(target?.current?.getBoundingClientRect())
    }, [target])
  
    useResizeObserver(target, (entry) => setSize(entry.contentRect))
    return size
  };

export const Countdown = ({
    seconds,
    fontSize,
    beep,
}: {
    seconds: number;
    fontSize: number;
    beep?: (freq?: number, duration?: number, vol?: number) => void;
}) => {

    const container = useRef<HTMLDivElement>(null);
    const size = useSize(container);

    useEffect(() => {
        if (beep && secondsToPlay.includes(seconds)) {
            const config = {
                frequency: secondsToPlay[0] === seconds ? 784 : 523,
                duration: seconds === 0 ? 1000 : 500,
                volume: seconds === 5 ? 0.1 : 100,
            };

            beep(config.frequency, config.duration, config.volume);
        }
    }, [seconds, beep]);

    return (
        <div ref={container} className="flex-grow w-full flex flex-col items-center justify-center">
            <div
                style={{ fontSize: `${fontSize}vh` }}
                className={classNames(
                    ["font-mono font-black leading-none transition-all text-center"],
                    {
                        ["text-white"]: seconds > 4,
                        ["text-orange-500"]: seconds <= 4
                    }
                )}
            >
                {/* {seconds} */}
                {formatSecondsToTimeSpan(seconds)}
            </div>
        </div>
    );
};
