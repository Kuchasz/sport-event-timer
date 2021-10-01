import Head from "next/head";
import Layout from "../components/layout";
import { Fragment, useEffect, useState } from "react";
import { getState } from "../api";
import { Loader } from "../components/loader";
import { TimerState } from "@set/timer/store";
// import { readFile } from "fs";
// import { resolve } from "path";

export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });

export const formatTime = (time?: number) => {
    if (time === undefined) return "--:--:--";

    const timeDate = new Date(time);

    return `${formatNumber(timeDate.getHours())}:${formatNumber(timeDate.getMinutes())}:${formatNumber(
        timeDate.getSeconds()
    )}.${formatNumber(timeDate.getMilliseconds(), 3).slice(0, 1)}`;
};

const tdClassName = "flex border flex-1 p-2 text-sm";

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

    const fullNumberColumns =
        "auto minmax(auto, 2fr) minmax(auto, 2fr) minmax(auto, 2fr) auto auto auto minmax(auto, 1fr) minmax(auto, 1fr)";

    return (
        <>
            <Layout>
                <Head>
                    <title>Wyniki na żywo</title>
                </Head>
                <div className="border-1 border-gray-600 border-solid">
                    <div className={`grid`} style={{ gridTemplateColumns: fullNumberColumns }}>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Nr. zaw.</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Imię Nazwisko</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Miejscowość</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Klub</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Kraj</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Rok urodz.</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Kat.</div>
                        {state.timeKeepers.map((tk) => (
                            <div
                                key={tk.id}
                                className={`${tdClassName + " bg-orange-600 text-white font-semibold"} ${
                                    tk.type === "checkpoint" ? "hidden sm:flex" : ""
                                }`}
                            >
                                {tk.name}
                            </div>
                        ))}

                        {state.players.map((p) => (
                            <Fragment key={p.id}>
                                <div className={tdClassName}>{p.number}</div>
                                <div className={`${tdClassName} hidden sm:block`}>{getName(p.name, p.lastName)}</div>
                                <div className={`${tdClassName} block sm:hidden`}>
                                    {getCompactName(p.name, p.lastName)}
                                </div>
                                <div className={tdClassName}>{p.city}</div>
                                <div className={tdClassName}>{p.team}</div>
                                <div className={tdClassName}>{p.country}</div>
                                <div className={tdClassName}>{p.birthYear}</div>
                                <div className={tdClassName}>{p.raceCategory}</div>
                                {state.timeKeepers.map((tk) => (
                                    <div
                                        key={`${p.id}${tk.id}`}
                                        className={`${tdClassName} ${tk.type === "checkpoint" ? "hidden sm:flex" : ""}`}
                                    >
                                        {formatTime(
                                            state.timeStamps.find(
                                                (ts) => ts.playerId === p.id && ts.timeKeeperId === tk.id
                                            )?.time
                                        )}
                                    </div>
                                ))}
                            </Fragment>
                        ))}
                    </div>
                </div>
            </Layout>
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
