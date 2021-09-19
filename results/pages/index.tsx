import Head from "next/head";
import Layout from "../components/layout";
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
                <table className="flex flex-col border-1 border-gray-600 border-solid">
                    <thead className="text-white bg-gradient-to-r from-orange-500 to-red-500">
                        <tr className="flex">
                            <th className={tdClassName}>Number</th>
                            <th className={tdClassName}>Name</th>
                            <th className={tdClassName}>Last Name</th>
                            {state.timeKeepers.map((tk) => (
                                <th key={tk.id} className={tdClassName}>
                                    {tk.name}
                                </th>
                            ))}
                            <th className={tdClassName}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.players.map((p) => (
                            <tr key={p.id} className="flex">
                                <td className={tdClassName}>{p.number}</td>
                                <td className={tdClassName}>{p.name}</td>
                                <td className={tdClassName}>{p.lastName}</td>
                                {state.timeKeepers.map((tk) => (
                                    <td key={`${p.id}${tk.id}`} className={tdClassName}>
                                        {formatTime(
                                            state.timeStamps.find(
                                                (ts) => ts.playerId === p.id && ts.timeKeeperId === tk.id
                                            )?.time
                                        )}
                                    </td>
                                ))}
                                <td className={tdClassName}>
                                    {calculateFinalTime(
                                        state.timeStamps.find(
                                            (ts) => ts.playerId === p.id && ts.timeKeeperId === startTimeKeeper?.id
                                        )?.time,
                                        state.timeStamps.find(
                                            (ts) => ts.playerId === p.id && ts.timeKeeperId === stopTimeKeeper?.id
                                        )?.time
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
