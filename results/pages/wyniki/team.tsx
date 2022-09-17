import Head from "next/head";
import Icon from "@mdi/react";
import Link from "next/link";
import React from "react";
import { getGCPlayers, getGCResults } from "../../api";
import { Loader } from "../../components/loader";
import { mdiKeyboardBackspace } from "@mdi/js";
import { Player } from "@set/timer/dist/model";
import { PlayerResult, sort } from "@set/utils/dist";
import { Table } from "../../components/table";
import { TimerState } from "@set/timer/dist/store";
import { useEffect, useState } from "react";

export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });

export const formatSpeed = (result: number, raceDistanceInMeters: number) =>
    Math.round((raceDistanceInMeters / (result / 1000 / 60 / 60) / 1000) * 100) / 100;

export const formatTime = (time?: number) => {
    if (time === undefined) return "--:--:--";

    const timeDate = new Date(0, 0, 0, 0, 0, 0, time);

    return `${formatNumber(timeDate.getHours())}:${formatNumber(timeDate.getMinutes())}:${formatNumber(
        timeDate.getSeconds()
    )}.${formatNumber(timeDate.getMilliseconds(), 3).slice(0, 1)}`;
};

type Props = {
    state: TimerState;
};

const calculateFinalTimeStr = (status: string, result?: number) => {
    if (!result) return status ?? "--:--:--";

    const timeDate = new Date(result);

    return `${formatNumber(timeDate.getUTCHours())}:${formatNumber(timeDate.getUTCMinutes())}:${formatNumber(
        timeDate.getUTCSeconds()
    )}.${formatNumber(timeDate.getMilliseconds(), 3).slice(0, 1)}`;
};

const getCompactName = (name: string, lastName: string) => `${name.slice(0, 1)}. ${lastName}`;

const Index = ({}: Props) => {
    const [raceTimes, setRaceTimes] = useState<PlayerResult[]>();
    const [players, setPlayers] = useState<Player[]>();

    useEffect(() => {
        const fetchResults = () => {
            getGCResults().then(setRaceTimes);
            getGCPlayers().then(setPlayers);
        };

        fetchResults();

        const interval = setInterval(fetchResults, 5000);

        return () => clearInterval(interval);
    }, []);

    if (!raceTimes || !players)
        return (
            <div className="flex font-semibold justify-center items-center">
                Smarujemy łańcuch...
                <Loader />
            </div>
        );

    const playersWithTimes = raceTimes.map(raceTime => ({
        ...raceTime,
        ...players.find(p => p.number === raceTime.number)!,
        resultStr: calculateFinalTimeStr(raceTime.status, raceTime.result)
    }));

    const groupedByTeams = playersWithTimes
        .filter(p => p.team)
        .reduce(
            (acc: { [team: string]: typeof playersWithTimes }, cur) => ({
                ...acc,
                [cur.team]: [...(acc[cur.team] || []), cur]
            }),
            {}
        );

    const teams = Object.entries(groupedByTeams)
        .filter(([_, members]) => members.length >= 4 && members.find(m => m.gender === "female"))
        .map(([name, members]) => {
            const [m1, m2, m3, m4, ...rest] = sort(members, m => m.result || Number.MAX_VALUE);
            return {
                name,
                m1,
                m2,
                m3,
                m4: [m1, m2, m3, m4].find(m => m.gender !== "male") ? m4 : rest.find(m => m.gender === "female")!
            };
        });

    const teamsResults = teams.map(t => ({
        ...t,
        status:
            t.m1.status === t.m2.status && t.m3.status === t.m4.status && t.m4?.status === "OK"
                ? "OK"
                : [t.m1.status, t.m2.status, t.m3.status, t.m4.status].filter(s => !["OK", ">>>"].includes(s))
                      .length === 0
                ? ">>>"
                : [t.m1.status, t.m2.status, t.m3.status, t.m4.status].find(s => !["OK", ">>>"].includes(s))!
    }));

    const teamsTimes = teamsResults.map(t => ({
        ...t,
        result: t.status === "OK" ? t.m1.result! + t.m2.result! + t.m3.result! + t.m4.result! : undefined
    }));

    const sorted = sort(teamsTimes, p => p.result || 3_600_600 * 12);
    const first = sorted[0];

    let place = 1;
    const result = sorted.map(s => ({
        ...s,
        place: s.result ? place++ : undefined,
        diff: s.result ? s.result - first.result! : undefined,
        diffStr: s.result ? formatTime(s.result! - first.result!) : undefined,
        resultStr: calculateFinalTimeStr(s.status, s.result)
    }));

    type itemsType = typeof result[0];

    const headers = [
        <div>M.</div>,
        <div>Klub</div>,
        <div className="hidden md:block">Zawodnicy</div>,
        <div className="hidden md:block">Czasy</div>,
        // <div className="hidden sm:block">Klub</div>,
        // <div className="hidden sm:block">Kraj</div>,
        // <div className="hidden lg:block">Rok urodz.</div>,
        <div className="hidden lg:block">VŚr km/h</div>,
        <div>Wynik</div>,
        <div className="hidden sm:block">Strata</div>
    ];

    return (
        <>
            <Head>
                <title>Wyniki klasyfikacji drużynowej</title>
            </Head>
            <div className="p-8 ">
                <h2 className="text-4xl font-semibold">Klasyfikacja drużynowa</h2>
                <Link href="/wyniki">
                    <span className="flex mt-2 cursor-pointer hover:text-orange-600">
                        <Icon size={1} path={mdiKeyboardBackspace} />
                        <span className="pl-2 font-semibold">Powrót do listy klasyfikacji</span>
                    </span>
                </Link>
            </div>
            <div className="flex flex-col text-zinc-600">
                <Table headers={headers} rows={result} getKey={r => String(r.name)}>
                    <Table.Item render={(r: itemsType) => <div>{r.place}</div>}></Table.Item>
                    <Table.Item render={(r: itemsType) => <div>{r.name}</div>}></Table.Item>
                    <Table.Item
                        render={(r: itemsType) => (
                            <div>
                                <div>
                                    {r.m1.number} {getCompactName(r.m1.name, r.m1.lastName)}
                                </div>
                                <div>
                                    {r.m2.number} {getCompactName(r.m2.name, r.m2.lastName)}
                                </div>
                                <div>
                                    {r.m3.number} {getCompactName(r.m3.name, r.m3.lastName)}
                                </div>
                                <div>
                                    {r.m4.number} {getCompactName(r.m4.name, r.m4.lastName)}
                                </div>
                            </div>
                        )}
                    ></Table.Item>
                    <Table.Item
                        render={(r: itemsType) => (
                            <div>
                                <div>{calculateFinalTimeStr(r.m1.status, r.m1.result)}</div>
                                <div>{calculateFinalTimeStr(r.m2.status, r.m2.result)}</div>
                                <div>{calculateFinalTimeStr(r.m3.status, r.m3.result)}</div>
                                <div>{calculateFinalTimeStr(r.m4.status, r.m4.result)}</div>
                            </div>
                        )}
                    ></Table.Item>

                    <Table.Item
                        render={(r: itemsType) => (
                            <div className="hidden lg:block">
                                {r.result ? formatSpeed(r.result, (10_700 + 79_860) * 4) : ""}
                            </div>
                        )}
                    ></Table.Item>
                    <Table.Item
                        render={(r: itemsType) => <div className="font-semibold">{r.resultStr}</div>}
                    ></Table.Item>
                    <Table.Item
                        render={(r: itemsType) => (
                            <div className="hidden sm:block">
                                {r.diff === 0 || r.diff === undefined ? "" : "+ " + r.diffStr}
                            </div>
                        )}
                    ></Table.Item>
                </Table>
            </div>
        </>
    );
};

export default Index;
