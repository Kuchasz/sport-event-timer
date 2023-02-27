import classNames from "classnames";
// import { useEffect, useRef } from "react";

import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";
import { formatSecondsToTimeSpan } from "utils";

const secondsToPlay = [0, 1, 2, 3, 4, 5];

const useSize = <T extends HTMLElement>(target: RefObject<T>) => {
    const [size, setSize] = useState<DOMRect>();

    useLayoutEffect(() => {
        setSize(target?.current?.getBoundingClientRect());
    }, [target]);

    useResizeObserver(target, entry => setSize(entry.contentRect));
    return size;
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
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const containerSize = useSize(containerRef);
    const textSize = useSize(textRef);

    useEffect(() => {
        if (textRef.current && containerSize) {
            const textSize = { width: textRef.current.offsetWidth, height: textRef.current.offsetHeight };
            const scale = Math.min(containerSize.width / textSize.width, containerSize.height / textSize.height);
            textRef.current.style.transform = `scale(${scale})`;
        }
    }, [containerSize, textSize]);

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
        <div ref={containerRef} className="flex-grow w-full flex flex-col items-center justify-center">
            <div
                ref={textRef}
                style={{ fontSize: `${fontSize}vh` }}
                className={classNames(["font-mono font-black leading-none transition-all text-center"], {
                    ["text-white"]: seconds > 4,
                    ["text-orange-500"]: seconds <= 4,
                })}
            >
                {/* {seconds} */}
                {formatSecondsToTimeSpan(seconds)}
            </div>
            {/* {JSON.stringify(containerSize)} */}
        </div>
    );
};
