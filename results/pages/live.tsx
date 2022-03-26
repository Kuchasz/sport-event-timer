import Head from "next/head";
import { getState } from "../api";
import { Loader } from "../components/loader";
import { Table } from "../components/table";
import { TimerState } from "@set/timer/store";
import { useEffect, useState } from "react";

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

const getName = (name: string, lastName: string) => `${name} ${lastName}`;
const getCompactName = (name: string, lastName: string) => `${name.slice(0, 1)}. ${lastName}`;

const Index = ({}: Props) => {
    const [state, setState] = useState<TimerState>();
    useEffect(() => {
        getState().then(setState);
    }, []);
    if (!state)
        return (
            <div className="min-w-screen min-h-screen flex font-semibold justify-center items-center">
                Smarujemy łańcuch...
                <Loader />
            </div>
        );

    const result = state.players;

    type itemsType = typeof result[0];

    const headers = ["Nr. zaw.", "Imię Nazwisko", "Miejscowość", "Klub", "Kraj", "Rok urodz.", "Kat."].concat(
        state.timeKeepers.map((tk) => tk.name)
    );

    return (
        <>
            <Head>
                <title>Wyniki na żywo</title>
            </Head>
            <div className="border-1 border-gray-600 border-solid">
                <Table headers={headers} rows={result} getKey={(r) => String(r.id)}>
                    <Table.Item render={(r: itemsType) => <div>{r.number}</div>}></Table.Item>
                    <Table.Item
                        render={(r: itemsType) => (
                            <>
                                <div className="hidden font-semibold sm:block">{getName(r.name, r.lastName)}</div>
                                <div className="block font-semibold sm:hidden">
                                    {getCompactName(r.name, r.lastName)}
                                </div>
                            </>
                        )}
                    ></Table.Item>
                    <Table.Item render={(r: itemsType) => <div>{r.city}</div>}></Table.Item>
                    <Table.Item render={(r: itemsType) => <div>{r.team}</div>}></Table.Item>
                    <Table.Item render={(r: itemsType) => <div>{r.country}</div>}></Table.Item>
                    <Table.Item render={(r: itemsType) => <div>{r.birthYear}</div>}></Table.Item>
                    <Table.Item render={(r: itemsType) => <div>{r.raceCategory}</div>}></Table.Item>
                    <Table.Item
                        render={(r: itemsType) => (
                            <div>
                                {formatTime(
                                    state.timeStamps.find((ts) => ts.playerId === r.id && ts.timeKeeperId === 0)?.time
                                )}
                            </div>
                        )}
                    ></Table.Item>
                    <Table.Item
                        render={(r: itemsType) => (
                            <div>
                                {formatTime(
                                    state.timeStamps.find((ts) => ts.playerId === r.id && ts.timeKeeperId === 1)?.time
                                )}
                            </div>
                        )}
                    ></Table.Item>
                </Table>
            </div>
        </>
    );
};

export default Index;

// export const getServerSideProps = async () => {
//     return new Promise((res, _) => {
//         readFile(resolve("../state.json"), (err, data) => {
//             if (err) throw err;
//             let state = JSON.parse(data as any);

//             res({ props: { state } });
//         });
//     });
// };
