import Head from "next/head";
import Layout from "../components/layout";
import { Fragment, useEffect } from "react";
import { getPlayers, getPlayersDate } from "api";
import { Player } from "../../timer/model";
import { TimerState } from "@set/timer/store";
import { useState } from "react";

export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });

export const formatTime = (time?: number) => {
    if (time === undefined) return "--:--:--";

    const timeDate = new Date(time);

    return `${formatNumber(timeDate.getHours())}:${formatNumber(timeDate.getMinutes())}:${formatNumber(
        timeDate.getSeconds()
    )}.${formatNumber(timeDate.getMilliseconds(), 3).slice(0, 1)}`;
};

const tdClassName = "flex flex-1 py-2 justify-center items-center even:bg-gray-100 border border-gray-200 p-1";

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
    )}.${formatNumber(startTime.getMilliseconds(), 3).slice(0, 1)}`;
};

const getName = (name: string, lastName: string) => `${name} ${lastName}`;
const getCompactName = (name: string, lastName: string) => `${name.slice(0, 1)}. ${lastName}`;

const StartingList = ({}: Props) => {
    const [state, setState] = useState<Player[]>();
    const [playersDate, setPlayersDate] = useState<number>();

    useEffect(() => {
        getPlayers().then(setState);
        getPlayersDate().then(setPlayersDate);
    }, []);
    if (state === undefined || playersDate === undefined) return <div>Ładowanie danych</div>;

    return (
        <>
            <Layout>
                <Head>
                    <title>Lista zawodników</title>
                </Head>
                <div className="border-1 border-gray-600 border-solid">
                    <div className="px-4 py-2">Ostatnia aktualizacja: {new Date(playersDate).toLocaleString()}</div>
                    <div
                        className="grid grid-cols-results-5"
                        style={{
                            gridTemplateColumns: "auto minmax(auto, 2fr) auto minmax(auto, 3fr) minmax(auto, 1fr)"
                        }}
                    >
                        <div className={tdClassName + " font-bold"}>Numer</div>
                        <div className={tdClassName + " font-bold"}>Imię i nazwisko</div>
                        <div className={tdClassName + " font-bold"}>Kat.</div>
                        <div className={tdClassName + " font-bold"}>Drużyna</div>
                        <div className={tdClassName + " font-bold"}>Start</div>

                        {state.map((p) => (
                            <Fragment key={p.id}>
                                <div style={{ pageBreakInside: "avoid" }} className={tdClassName}>
                                    {p.number}
                                </div>
                                <div style={{ pageBreakInside: "avoid" }} className={`${tdClassName} hidden sm:flex`}>
                                    {getName(p.name, p.lastName)}
                                </div>
                                <div
                                    style={{ pageBreakInside: "avoid" }}
                                    className={`${tdClassName} text-xs sm:text-base flex sm:hidden`}
                                >
                                    {getCompactName(p.name, p.lastName)}
                                </div>
                                <div style={{ pageBreakInside: "avoid" }} className={tdClassName}>
                                    {p.raceCategory}
                                </div>
                                <div
                                    style={{ pageBreakInside: "avoid" }}
                                    className={`${tdClassName} text-xs sm:text-base`}
                                >
                                    {p.team}
                                </div>
                                <div style={{ pageBreakInside: "avoid" }} className={tdClassName}>
                                    {calculateStartTime(p.number)}
                                </div>
                            </Fragment>
                        ))}
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default StartingList;
