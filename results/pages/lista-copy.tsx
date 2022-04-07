import Head from "next/head";
import { getPlayers, getPlayersDate } from "api";
import { Loader } from "../components/loader";
import { Player } from "@set/timer/model";
import { Table } from "../components/table";
import { TimerState } from "@set/timer/store";
import { useEffect } from "react";
import { useState } from "react";

export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });

export const formatTime = (time?: number) => {
    if (time === undefined) return "--:--:--";

    const timeDate = new Date(time);

    return `${formatNumber(timeDate.getHours())}:${formatNumber(timeDate.getMinutes())}:${formatNumber(
        timeDate.getSeconds()
    )}`;
};

type Props = {
    state: TimerState;
};

const getName = (name: string, lastName: string) => `${name} ${lastName}`;
const getCompactName = (name: string, lastName: string) => `${name.slice(0, 1)}. ${lastName}`;

const StartingList = ({}: Props) => {
    const [players, setPlayers] = useState<Player[]>();

    useEffect(() => {
        getPlayers().then(setPlayers);
    }, []);
    if (players === undefined)
        return (
            <div className="min-w-screen min-h-screen flex font-semibold justify-center items-center">
                Smarujemy łańcuch...
                <Loader />
            </div>
        );

    const result = players;
    type itemsType = typeof result[0];

    const headers = [
        <div>Nr.</div>,
        <div>Zawodnik</div>,
        <div className="hidden md:block">Miejscowość</div>,
        <div className="hidden sm:block">Kraj</div>,
        <div>Kat.</div>,
        <div>Klub</div>
    ];

    return (
        <>
            <Head>
                <title>Lista zawodników</title>
            </Head>
            <div className="border-1 border-gray-600 border-solid">
                <Table headers={headers} rows={result} getKey={r => String(r.number)}>
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
                    <Table.Item render={(r: itemsType) => <div className="hidden md:block">{r.city}</div>}></Table.Item>
                    <Table.Item
                        render={(r: itemsType) => <div className="hidden sm:block">{r.country}</div>}
                    ></Table.Item>
                    <Table.Item render={(r: itemsType) => <div>{r.raceCategory}</div>}></Table.Item>
                    <Table.Item render={(r: itemsType) => <div>{r.team}</div>}></Table.Item>
                </Table>
            </div>
        </>
    );
};

export default StartingList;
