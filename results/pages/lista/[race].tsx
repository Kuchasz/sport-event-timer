import Head from "next/head";
import { getFunRacePlayers, getProRacePlayers, getTimeTrialPlayers } from "api";
import { Loader } from "../../components/loader";
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
            <div className="p-8 ">
                <h2 className="text-4xl font-semibold">{playersListsNames[race]}</h2>
                <span>{players.length} zawodników</span>
            </div>
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