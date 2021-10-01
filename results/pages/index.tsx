import Head from "next/head";
import Layout from "../components/layout";
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
                    <img
                        className="h-full w-full absolute object-center object-cover top-0 -z-1 blur filter"
                        src="assets/blog/compressed-background.jpg"
                    ></img>
                    <div className="min-h-screen min-w-screen text-xl text-black flex items-center justify-center">
                        {/* <h1 className="text-6xl font-semibold text-white">Rura na Kocierz</h1> */}
                        <img width="400px" src="assets/blog/logo.png"></img>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Index;
