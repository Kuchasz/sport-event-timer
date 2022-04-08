import classNames from "classnames";
import Head from "next/head";
import Icon from "@mdi/react";
import Link from "next/link";
import React from "react";
import { getPlayers, getProRaceResults } from "../../api";
import { Loader } from "../../components/loader";
import { mdiMenu } from "@mdi/js";
import { Player } from "@set/timer/model";
import { PlayerResult, sort } from "@set/shared/dist";
import { Table } from "../../components/table";
import { TimerState } from "@set/timer/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";

export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });

const raceDistanceInMeters = 13_330;

export const formatSpeed = (result: number) =>
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

const filterByType = (type: Types) => (player: Player) => {
    if (!type) return true;

    // if (type == "open-m") return player.gender === "male";

    // if (type == "open-k") return player.gender === "female";

    return player.raceCategory == type;
};

const calculateFinalTimeStr = (status: string, result?: number) => {
    if (!result) return status ?? "--:--:--";

    const timeDate = new Date(result);

    return `${formatNumber(timeDate.getUTCHours())}:${formatNumber(timeDate.getUTCMinutes())}:${formatNumber(
        timeDate.getUTCSeconds()
    )}.${formatNumber(timeDate.getMilliseconds(), 3).slice(0, 1)}`;
};

const getName = (name: string, lastName: string) => `${name} ${lastName}`;
const getCompactName = (name: string, lastName: string) => `${name.slice(0, 1)}. ${lastName}`;

type Types =
    // | ""
    // | "open-k"
    // | "open-m"
    "K18-29" | "K30-39" | "K40-99" | "M18-29" | "M30-39" | "M40-49" | "M50-59" | "M60-99";

const types: Types[] = [
    // "",
    // "open-k",
    // "open-m",
    "K18-29",
    "K30-39",
    "K40-99",
    "M18-29",
    "M30-39",
    "M40-49",
    "M50-59",
    "M60-99"
];

const ResultLink = ({
    type,
    selectedType,
    text,
    onOpen
}: {
    type: Types;
    selectedType: Types;
    text: string;
    onOpen: () => void;
}) => (
    <Link href={`/wyniki_new/${type}`}>
        <a
            onClick={onOpen}
            className={classNames(
                "cursor-pointer border-b-2 px-2 md:mx-2 self-center my-2 md:my-0 py-2 text-center text-zinc-400 text-sm font-medium",
                { ["text-orange-500 border-orange-500"]: selectedType == type },
                { ["border-white"]: selectedType != type }
            )}
        >
            {text}
        </a>
    </Link>
);

const namesForTypes = {
    "": "WSZYSCY",
    "open-k": "OPEN K",
    "open-m": "OPEN M",
    "K18-29": "K18-29",
    "K30-39": "K30-39",
    "K40-99": "K40-99",
    "M18-29": "M18-29",
    "M30-39": "M30-39",
    "M40-49": "M40-49",
    "M50-59": "M50-59",
    "M60-99": "M60-99"
};

const ResultLinks = ({ passedType }: { passedType: Types }) => {
    const [collapsed, setCollapsed] = useState<boolean>(true);
    return (
        <>
            <div className="md:hidden">
                <div
                    className={classNames("flex flex-col absolute top-0 z-10 h-full w-full bg-white px-2 py-4", {
                        ["hidden"]: collapsed
                    })}
                >
                    {types.map(t => (
                        <ResultLink
                            key={t}
                            onOpen={() => setCollapsed(true)}
                            selectedType={passedType}
                            type={t}
                            text={namesForTypes[t]}
                        />
                    ))}
                </div>
                <div onClick={() => setCollapsed(false)} className={classNames("flex p-2", { ["hidden"]: !collapsed })}>
                    <Icon size={1} path={mdiMenu}></Icon>
                    <p className="ml-2 font-medium">{namesForTypes[passedType]}</p>
                </div>
            </div>
            <div className="hidden md:flex flex-wrap px-2 py-4">
                {types.map(t => (
                    <ResultLink
                        key={t}
                        onOpen={() => setCollapsed(true)}
                        selectedType={passedType}
                        type={t}
                        text={namesForTypes[t]}
                    />
                ))}
            </div>
        </>
    );
};

const Index = ({}: Props) => {
    const [raceTimes, setRaceTimes] = useState<PlayerResult[]>();
    const [players, setPlayers] = useState<Player[]>();
    const router = useRouter();

    useEffect(() => {
        getProRaceResults().then(setRaceTimes);
        getPlayers().then(setPlayers);
    }, []);

    if (!raceTimes || !players)
        return (
            <div className="flex font-semibold justify-center items-center">
                Smarujemy łańcuch...
                <Loader />
            </div>
        );

    const { type } = router.query as { type: Types[] };
    const types = type || [];
    const passedType = (types[0] || "") as Types;

    const playersWithTimes = raceTimes
        .map(raceTime => ({
            ...raceTime,
            ...players.find(p => p.number === raceTime.number)!,
            resultStr: calculateFinalTimeStr(raceTime.status, raceTime.result)
        }))
        .filter(p => p.id !== undefined)
        .filter(filterByType(passedType));

    const sorted = sort(playersWithTimes, p => p.result || 3_600_600 * 12);
    const first = sorted[0];

    const result = sorted.map((s, i) => ({
        ...s,
        place: i + 1,
        diff: s.result ? s.result - first.result! : undefined,
        diffStr: s.result ? formatTime(s.result! - first.result!) : undefined
    }));

    type itemsType = typeof result[0];

    const headers = [
        <div>M.</div>,
        <div>Nr. zaw.</div>,
        <div>Zawodnik</div>,
        <div className="hidden md:block">Miejscowość</div>,
        <div className="hidden sm:block">Klub</div>,
        <div className="hidden sm:block">Kraj</div>,
        <div className="hidden lg:block">Rok urodz.</div>,
        <div>Kat.</div>,
        <div className="hidden lg:block">VŚr km/h</div>,
        <div>Wynik</div>,
        <div className="hidden sm:block">Strata</div>
    ];

    return (
        <>
            <Head>
                <title>Wyniki {passedType ? `- ${passedType}` : ""}</title>
            </Head>
            <div className="flex flex-col text-zinc-600">
                <ResultLinks passedType={passedType} />

                <Table headers={headers} rows={result} getKey={r => String(r.id)}>
                    <Table.Item render={(r: itemsType) => <div>{r.place}</div>}></Table.Item>
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
                    <Table.Item render={(r: itemsType) => <div className="hidden sm:block">{r.team}</div>}></Table.Item>
                    <Table.Item
                        render={(r: itemsType) => <div className="hidden sm:block">{r.country}</div>}
                    ></Table.Item>
                    <Table.Item
                        render={(r: itemsType) => <div className="hidden lg:block">{r.birthYear}</div>}
                    ></Table.Item>
                    <Table.Item render={(r: itemsType) => <div>{r.raceCategory}</div>}></Table.Item>
                    <Table.Item
                        render={(r: itemsType) => (
                            <div className="hidden lg:block">{r.result ? formatSpeed(r.result) : ""}</div>
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
