import classNames from "classnames";
import Head from "next/head";
import Icon from "@mdi/react";
import Link from "next/link";
import React from "react";
import {
    getFunRacePlayers,
    getFunRaceResults,
    getProRacePlayers,
    getProRaceResults,
    getTimeTrialPlayers,
    getTimeTrialRaceResults
    } from "../../../api";
import { Loader } from "../../../components/loader";
import { mdiKeyboardBackspace, mdiMenu } from "@mdi/js";
import { Player } from "@set/timer/model";
import { PlayerResult, sort } from "@set/shared/dist";
import { Table } from "../../../components/table";
import { TimerState } from "@set/timer/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";

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

const filterByCategory = (category: Categories) => (player: Player) => {
    if (!category) return true;
    return player.raceCategory == category;
};

type Races = "pro" | "fun" | "tt";

const racesTypes: Races[] = ["pro", "fun", "tt"];

const races = {
    pro: { getList: getProRacePlayers, getResults: getProRaceResults, title: "RnK PRO", distance: 79_860 },
    fun: { getList: getFunRacePlayers, getResults: getFunRaceResults, title: "RnK FUN", distance: 53_620 },
    tt: { getList: getTimeTrialPlayers, getResults: getTimeTrialRaceResults, title: "RnK Time Trial", distance: 10_700 }
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

type Categories = "K18-29" | "K30-39" | "K40-99" | "M18-29" | "M30-39" | "M40-49" | "M50-59" | "M60-99";

const categories: Categories[] = ["K18-29", "K30-39", "K40-99", "M18-29", "M30-39", "M40-49", "M50-59", "M60-99"];

const ResultLink = ({
    race,
    category,
    selectedCategory,
    text,
    onOpen
}: {
    race: Races;
    category: Categories;
    selectedCategory: Categories;
    text: string;
    onOpen: () => void;
}) => (
    <Link href={`/wyniki/${race}/${category}`}>
        <a
            onClick={onOpen}
            className={classNames(
                "cursor-pointer border-b-2 px-2 md:mx-2 self-center my-2 md:my-0 py-2 text-center text-zinc-400 text-sm font-medium",
                { ["text-orange-500 border-orange-500"]: selectedCategory == category },
                { ["border-white"]: selectedCategory != category }
            )}
        >
            {text}
        </a>
    </Link>
);

const namesForTypes = {
    "K18-29": "K18-29",
    "K30-39": "K30-39",
    "K40-99": "K40-99",
    "M18-29": "M18-29",
    "M30-39": "M30-39",
    "M40-49": "M40-49",
    "M50-59": "M50-59",
    "M60-99": "M60-99"
};

const ResultLinks = ({ category, race }: { category: Categories; race: Races }) => {
    const [collapsed, setCollapsed] = useState<boolean>(true);
    return (
        <>
            <div className="md:hidden">
                <div
                    className={classNames("flex flex-col absolute top-0 z-10 h-full w-full bg-white px-2 py-4", {
                        ["hidden"]: collapsed
                    })}
                >
                    {categories.map(c => (
                        <ResultLink
                            key={c}
                            onOpen={() => setCollapsed(true)}
                            selectedCategory={category}
                            category={c}
                            race={race}
                            text={namesForTypes[c]}
                        />
                    ))}
                </div>
                <div onClick={() => setCollapsed(false)} className={classNames("flex p-2", { ["hidden"]: !collapsed })}>
                    <Icon size={1} path={mdiMenu}></Icon>
                    <p className="ml-2 font-medium">KATEGORIA {namesForTypes[category]}</p>
                </div>
            </div>
            <div className="hidden md:flex flex-wrap px-2 py-4">
                {categories.map(c => (
                    <ResultLink
                        key={c}
                        onOpen={() => setCollapsed(true)}
                        selectedCategory={category}
                        category={c}
                        race={race}
                        text={namesForTypes[c]}
                    />
                ))}
            </div>
        </>
    );
};

const Index = ({}: Props) => {
    const router = useRouter();

    const { race, category } = router.query as { race: Races; category: Categories };

    const [raceTimes, setRaceTimes] = useState<PlayerResult[]>();
    const [players, setPlayers] = useState<Player[]>();

    useEffect(() => {
        const interval = setInterval(() => {
            if (racesTypes.includes(race)) {
                races[race].getResults().then(setRaceTimes);
                races[race].getList().then(setPlayers);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [race]);

    if (!raceTimes || !players)
        return (
            <div className="flex font-semibold justify-center items-center">
                Smarujemy łańcuch...
                <Loader />
            </div>
        );

    const playersWithTimes = raceTimes
        .map(raceTime => ({
            ...raceTime,
            ...players.find(p => p.number === raceTime.number)!,
            resultStr: calculateFinalTimeStr(raceTime.status, raceTime.result)
        }))
        .filter(filterByCategory(category));

    const sorted = sort(playersWithTimes, p => p.result || 3_600_600 * 12);
    const first = sorted[0];

    let place = 1;
    const result = sorted.map(s => ({
        ...s,
        place: s.result ? place++ : undefined,
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
        <div className="hidden lg:block">VŚr km/h</div>,
        <div>Wynik</div>,
        <div className="hidden sm:block">Strata</div>
    ];

    return (
        <>
            <Head>
                <title>Wyniki {category ? `- ${category}` : ""}</title>
            </Head>
            <div className="p-8 ">
                <h2 className="text-4xl font-semibold">{races[race].title}</h2>
                <Link href="/wyniki">
                    <span className="flex mt-2 cursor-pointer hover:text-orange-600">
                        <Icon size={1} path={mdiKeyboardBackspace} />
                        <span className="pl-2 font-semibold">Powrót do listy klasyfikacji</span>
                    </span>
                </Link>
            </div>
            <div className="flex flex-col text-zinc-600">
                <ResultLinks category={category} race={race} />

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
                    <Table.Item
                        render={(r: itemsType) => (
                            <div className="hidden lg:block">
                                {r.result ? formatSpeed(r.result, races[race].distance) : ""}
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
