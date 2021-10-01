import Head from "next/head";
import Layout from "../components/layout";
import { FullscreenBackground } from "../components/fullscreen-background";
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
            <Layout>
                <Head>
                    <title>Rura na Kocierz</title>
                </Head>

                <div className="min-h-screen min-w-screen">
                    <FullscreenBackground />
                    <div className="min-h-screen min-w-screen text-xl text-black flex items-center justify-center">
                        <img width="400px" src="assets/blog/logo.png"></img>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Index;
