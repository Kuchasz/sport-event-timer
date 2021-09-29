import Head from "next/head";
import Layout from "../components/layout";
import { Fragment } from "react";
import { readFile } from "fs";
import { resolve } from "path";
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

const tdClassName = "flex flex-1 p-2 justify-center";

type Props = {
    state: TimerState;
};

const calculateFinalTime = (start?: number, end?: number) => {
    if (!start || !end) return "--:--:--";

    const timeDate = new Date(end - start);

    return `${formatNumber(timeDate.getUTCHours())}:${formatNumber(timeDate.getUTCMinutes())}:${formatNumber(
        timeDate.getUTCSeconds()
    )}.${formatNumber(timeDate.getMilliseconds(), 3).slice(0, 1)}`;
};

const Index = ({ state }: Props) => {
    const startTimeKeeper = state.timeKeepers.find((x) => x.type === "start");
    const stopTimeKeeper = state.timeKeepers.find((x) => x.type === "end");
    const fullNumberColumns = `sm:grid-cols-results-${
        5 + state.timeKeepers.filter((tk) => tk.type === "checkpoint").length
    }`;

    return (
        <>
            <Layout>
                <Head>
                    <title>Results</title>
                </Head>
                <div className="border-1 border-gray-600 border-solid">
                    <div className={`grid grid-cols-results-5 ${fullNumberColumns} text-gray-600`}>
                        <div className={tdClassName + " bg-orange-600"}>#</div>
                        <div className={tdClassName + " bg-orange-600"}>Name</div>
                        {state.timeKeepers.map((tk) => (
                            <div
                                key={tk.id}
                                className={`${tdClassName + " bg-orange-600"} ${
                                    tk.type === "checkpoint" ? "hidden sm:flex" : ""
                                }`}
                            >
                                {tk.name}
                            </div>
                        ))}
                        <div className={tdClassName + " bg-orange-600"}>Total</div>

                        {state.players.map((p) => (
                            <Fragment key={p.id}>
                                <div className={tdClassName}>{p.number}</div>
                                <div className={`${tdClassName} hidden sm:block`}>
                                    {p.name} {p.lastName}
                                </div>
                                <div className={`${tdClassName} block sm:hidden`}>
                                    {p.name.slice(0, 1)}. {p.lastName}
                                </div>
                                {state.timeKeepers.map((tk) => (
                                    <div
                                        key={`${p.id}${tk.id}`}
                                        className={`${tdClassName} ${tk.type === "checkpoint" ? "hidden sm:flex" : ""}`}
                                    >
                                        {formatTime(
                                            state.timeStamps.find(
                                                (ts) => ts.playerId === p.id && ts.timeKeeperId === tk.id
                                            )?.time
                                        )}
                                    </div>
                                ))}
                                <div className={tdClassName}>
                                    {calculateFinalTime(
                                        state.timeStamps.find(
                                            (ts) => ts.playerId === p.id && ts.timeKeeperId === startTimeKeeper?.id
                                        )?.time,
                                        state.timeStamps.find(
                                            (ts) => ts.playerId === p.id && ts.timeKeeperId === stopTimeKeeper?.id
                                        )?.time
                                    )}
                                </div>
                            </Fragment>
                        ))}
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Index;

export const getServerSideProps = async () => {
    return new Promise((res, _) => {
        readFile(resolve("../state.json"), (err, data) => {
            if (err) throw err;
            let state = JSON.parse(data as any);

            res({ props: { state } });
        });
    });
};
