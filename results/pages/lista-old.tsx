import Head from "next/head";
import { getPlayers, getPlayersDate } from "api";
import { Loader } from "../components/loader";
import { Player } from "@set/timer/model";
import { Table } from "../components/table";
import { TimerState } from "@set/timer/dist/store";
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

function addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000);
}

const calculateStartTime = (startNumber: number) => {
    const initialStartTime = new Date(1970, 0, 1, 10, 0);
    const startTime = addMinutes(initialStartTime, startNumber - 1);

    return `${formatNumber(startTime.getHours())}:${formatNumber(startTime.getMinutes())}:${formatNumber(
        startTime.getSeconds()
    )}`;
};

const getName = (name: string, lastName: string) => `${name} ${lastName}`;
const getCompactName = (name: string, lastName: string) => `${name.slice(0, 1)}. ${lastName}`;

const StartingList = ({}: Props) => {
    const [players, setPlayers] = useState<Player[]>();
    const [playersDate, setPlayersDate] = useState<number>();

    useEffect(() => {
        getPlayers().then(setPlayers);
        getPlayersDate().then(setPlayersDate);
    }, []);
    if (players === undefined || playersDate === undefined)
        return (
            <div className="min-w-screen min-h-screen flex font-semibold justify-center items-center">
                Smarujemy łańcuch...
                <Loader />
            </div>
        );

    const result = players.map((s, i) => ({ ...s, index: i + 1, startTime: calculateStartTime(s.number) }));
    type itemsType = typeof result[0];

    const headers = [
        <div>Lp.</div>,
        <div>Numer</div>,
        <div>Zawodnik</div>,
        <div>Kat.</div>,
        <div>Kraj</div>,
        <div>Drużyna</div>,
        <div>Start</div>
    ];

    return (
        <>
            <Head>
                <title>Lista zawodników</title>
            </Head>
            <div className="border-1 border-gray-600 border-solid">
                <div className="px-4 py-2">Ostatnia aktualizacja: {new Date(playersDate).toLocaleString()}</div>

                <Table headers={headers} rows={result} getKey={r => String(r.number)}>
                    <Table.Item render={(r: itemsType) => <div>{r.index}</div>}></Table.Item>
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
                    <Table.Item render={(r: itemsType) => <div>{r.raceCategory}</div>}></Table.Item>
                    <Table.Item render={(r: itemsType) => <div>{r.country}</div>}></Table.Item>
                    <Table.Item render={(r: itemsType) => <div>{r.team}</div>}></Table.Item>
                    <Table.Item render={(r: itemsType) => <div>{r.startTime}</div>}></Table.Item>
                </Table>
            </div>
        </>
    );
};

export default StartingList;
