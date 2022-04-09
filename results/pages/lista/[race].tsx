import Head from "next/head";
import Icon from "@mdi/react";
import Link from "next/link";
import { formatTimeNoSec } from "@set/shared/dist";
import { getFunRacePlayers, getProRacePlayers, getTimeTrialPlayers } from "api";
import { Loader } from "../../components/loader";
import { mdiKeyboardBackspace } from "@mdi/js";
import { Player } from "@set/timer/model";
import { Table } from "../../components/table";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";

const getName = (name: string, lastName: string) => `${name} ${lastName}`;
const getCompactName = (name: string, lastName: string) => `${name.slice(0, 1)}. ${lastName}`;

type Races = "pro" | "fun" | "tt";

const racesTypes: Races[] = ["pro", "fun", "tt"];

const playersLists = {
    pro: getProRacePlayers,
    fun: getFunRacePlayers,
    tt: getTimeTrialPlayers
};

const playersListsNames = {
    pro: "RnK PRO",
    fun: "RnK FUN",
    tt: "RnK Time Trial"
};

const StartingList = () => {
    const router = useRouter();

    const { race } = router.query as { race: Races };

    const [players, setPlayers] = useState<Player[]>();

    useEffect(() => {
        if (racesTypes.includes(race)) playersLists[race]().then(setPlayers);
    }, [race]);
    if (players === undefined)
        return (
            <div className="min-w-screen min-h-screen flex font-semibold justify-center items-center">
                Smarujemy łańcuch...
                <Loader />
            </div>
        );

    const result = players.map((r, i) => ({ ...r, i: i + 1 }));
    type itemsType = typeof result[0];

    const headers = [
        <div>Lp.</div>,
        <div>Nr.</div>,
        <div>Zawodnik</div>,
        <div className="hidden md:block">Miejscowość</div>,
        <div className="hidden sm:block">Kraj</div>,
        <div>Kat.</div>,
        <div>Klub</div>,
        <div className={race === "tt" ? "block" : "hidden"}>Start</div>
    ];

    return (
        <>
            <Head>
                <title>Lista zawodników</title>
            </Head>
            <div className="p-8 ">
                <h2 className="text-4xl font-semibold">{playersListsNames[race]}</h2>
                <span>{players.length} zawodników</span>
                <Link href="/lista">
                    <span className="flex mt-2 cursor-pointer hover:text-orange-600">
                        <Icon size={1} path={mdiKeyboardBackspace} />
                        <span className="pl-2 font-semibold">Powrót do listy wyścigów</span>
                    </span>
                </Link>
            </div>
            <div className="w-full border-1 border-gray-600 border-solid">
                <Table headers={headers} rows={result} getKey={r => String(r.number)}>
                    <Table.Item render={(r: itemsType) => <div>{r.i}</div>}></Table.Item>
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
                    <Table.Item
                        render={(r: itemsType) => <div className="whitespace-nowrap">{r.raceCategory}</div>}
                    ></Table.Item>
                    <Table.Item render={(r: itemsType) => <div>{r.team}</div>}></Table.Item>
                    <Table.Item
                        render={(r: itemsType) => (
                            <div className={race === "tt" ? "block" : "hidden"}>{formatTimeNoSec(r.startTime)}</div>
                        )}
                    ></Table.Item>
                </Table>
            </div>
        </>
    );
};

export default StartingList;
