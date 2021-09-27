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

    return (
        <>
            <Layout>
                <Head>
                    <title>Results</title>
                </Head>
                <div className="border-1 border-gray-600 border-solid">
                    <div className="grid grid-cols-5 sm:grid-cols-7 text-gray-600">
                        <div className="text-white font-medium col-span-5 sm:col-span-7 grid grid-cols-5 sm:grid-cols-7 bg-gradient-to-r from-orange-500 to-red-500">
                            <div className={tdClassName}>Number</div>
                            <div className={tdClassName}>Name</div>
                            {state.timeKeepers.map((tk) => (
                                <div
                                    key={tk.id}
                                    className={`${tdClassName} ${tk.type === "checkpoint" ? "hidden sm:flex" : ""}`}
                                >
                                    {tk.name}
                                </div>
                            ))}
                            <div className={tdClassName}>Total</div>
                        </div>

                        {state.players.map((p) => (
                            <Fragment key={p.id}>
                                <div className={tdClassName}>{p.number}</div>
                                <div className={tdClassName}>
                                    {p.name} {p.lastName}
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