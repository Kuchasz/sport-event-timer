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

                <div className="h-full w-full">
                    <img
                        className="h-full w-full absolute object-center object-cover top-0 -z-1 blur filter"
                        src="assets/blog/compressed-background.jpg"
                    ></img>
                    {/* <div className="h-full w-full text-xl text-black flex">
                        <h1 className="min-h-full min-w-full text-xl text-black">Rura na Kocierz</h1>
                    </div> */}
                </div>
            </Layout>
        </>
    );
};

export default Index;
