import Head from "next/head";
import { TimerState } from "@set/timer/store";

export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });

export const formatTime = (time?: number) => {
    if (time === undefined) return "--:--:--";

    const timeDate = new Date(time);

    return `${formatNumber(timeDate.getHours())}:${formatNumber(timeDate.getMinutes())}:${formatNumber(
        timeDate.getSeconds()
    )}.${formatNumber(timeDate.getMilliseconds(), 3).slice(0, 1)}`;
};

type Props = {
    state: TimerState;
};

const Index = ({}: Props) => {
    return (
        <>
            <Head>
                <title>Rura na Kocierz</title>
            </Head>

            <div>
                <div
                    style={{ backgroundImage: "url('assets/kocierz.jpg')" }}
                    className="w-full h-128 bg-bottom bg-cover"
                ></div>
            </div>
        </>
    );
};

export default Index;
