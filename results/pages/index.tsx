import Head from "next/head";
import Layout from "../components/layout";
import { readFile } from "fs";
import { resolve } from "path";
import { TimerState } from "@set/timer/store";

export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });

export const formatTime = (time?: number) => {
    if (time === undefined) return "--:--:--";

    const ttime = new Date(time);

    return `${formatNumber(ttime.getHours())}:${formatNumber(ttime.getMinutes())}:${formatNumber(
        ttime.getSeconds()
    )}.${formatNumber(ttime.getMilliseconds(), 3).slice(0, 1)}`;
};

type Props = {
    state: TimerState;
};

const Index = ({ state }: Props) => {
    return (
        <>
            <Layout>
                <Head>
                    <title>Next.js Blog Example</title>
                </Head>
                <table className="flex flex-col border-1 border-gray-600 border-solid">
                    <thead className="text-white bg-green-700">
                        <tr className="flex">
                            <th className="flex flex-1 p-2">Number</th>
                            <th className="flex flex-1 p-2">Name</th>
                            <th className="flex flex-1 p-2">Last Name</th>
                            {state.timeKeepers.map((tk) => (
                                <th key={tk.id} className="flex flex-1 p-2">
                                    {tk.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {state.players.map((p) => (
                            <tr key={p.id} className="flex">
                                <td className="flex flex-1 p-2">{p.number}</td>
                                <td className="flex flex-1 p-2">{p.name}</td>
                                <td className="flex flex-1 p-2">{p.lastName}</td>
                                {state.timeKeepers.map((tk) => (
                                    <td key={`${p.id}${tk.id}`} className="flex flex-1 p-2">
                                        {formatTime(
                                            state.timeStamps.find(
                                                (ts) => ts.playerId === p.id && ts.timeKeeperId === tk.id
                                            )?.time
                                        )}
                                    </td>
                                ))}
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
