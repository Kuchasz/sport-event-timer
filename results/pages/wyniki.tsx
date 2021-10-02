import Head from "next/head";
import Layout from "../components/layout";
import { Fragment, useEffect, useState } from "react";
import { getState } from "../api";
import { Loader } from "../components/loader";
import { Player } from "@set/timer/model";
import { sort } from "../utils";
import { TimerState } from "@set/timer/store";

export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });

export const formatTime = (time?: number) => {
    if (time === undefined) return "--:--:--";

    const timeDate = new Date(0, 0, 0, 0, 0, 0, time);

    return `${formatNumber(timeDate.getHours())}:${formatNumber(timeDate.getMinutes())}:${formatNumber(
        timeDate.getSeconds()
    )}.${formatNumber(timeDate.getMilliseconds(), 3).slice(0, 1)}`;
};

const tdClassName = "flex border border-white flex-1 p-2 text-sm";

type Props = {
    state: TimerState;
};

const calculateFinalTimeStr = (start: number, end: number) => {
    if (!start || !end) return "--:--:--";

    const timeDate = new Date(end - start);

    return `${formatNumber(timeDate.getUTCHours())}:${formatNumber(timeDate.getUTCMinutes())}:${formatNumber(
        timeDate.getUTCSeconds()
    )}.${formatNumber(timeDate.getMilliseconds(), 3).slice(0, 1)}`;
};

const calculateFinalTime = (start: number, end: number) => {
    return new Date(end - start).getTime();
};

const getName = (name: string, lastName: string) => `${name} ${lastName}`;
const getCompactName = (name: string, lastName: string) => `${name.slice(0, 1)}. ${lastName}`;

type Types = "" | "open-k" | "open-m" | "K1" | "K2" | "K3" | "M1" | "M2" | "M3" | "M4";

const filterByType = (type: Types) => (player: Player) => {
    if (!type) return true;

    if (type == "open-m") return player.gender === "male";

    if (type == "open-k") return player.gender === "female";

    return player.raceCategory == type;
};

const ResultLink = ({ type, text, setType }: { type: Types; text: string; setType: (type: Types) => void }) => (
    <a
        onClick={() => setType(type)}
        className="flex-grow cursor-pointer px-4 py-2 text-center text-bold block m-1 text-white bg-orange-600"
    >
        {text}
    </a>
);

const Index = ({}: Props) => {
    const [state, setState] = useState<TimerState>();
    const [type, setType] = useState<Types>("");
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

    const startTimeKeeper = state.timeKeepers.find((x) => x.type === "start");
    const stopTimeKeeper = state.timeKeepers.find((x) => x.type === "end");
    const fullNumberColumns =
        "auto auto minmax(auto, 1fr) minmax(auto, 1fr) minmax(auto, 1fr) auto auto auto auto auto auto";

    const playersWithTimes = state.players
        .filter(filterByType(type as Types))
        .filter(
            (p) =>
                state.timeStamps.find((ts) => ts.playerId === p.id && ts.timeKeeperId === startTimeKeeper?.id)?.time &&
                state.timeStamps.find((ts) => ts.playerId === p.id && ts.timeKeeperId === stopTimeKeeper?.id)?.time
        )
        .map((p) => ({
            ...p,
            result: calculateFinalTime(
                state.timeStamps.find((ts) => ts.playerId === p.id && ts.timeKeeperId === startTimeKeeper?.id)!.time,
                state.timeStamps.find((ts) => ts.playerId === p.id && ts.timeKeeperId === stopTimeKeeper?.id)!.time
            ),
            resultStr: calculateFinalTimeStr(
                state.timeStamps.find((ts) => ts.playerId === p.id && ts.timeKeeperId === startTimeKeeper?.id)!.time,
                state.timeStamps.find((ts) => ts.playerId === p.id && ts.timeKeeperId === stopTimeKeeper?.id)!.time
            )
        }));

    const sorted = sort(playersWithTimes, (p) => p.result);
    const first = sorted[0];

    const result = sorted.map((s) => ({
        ...s,
        diff: s.result - first.result,
        diffStr: formatTime(s.result - first.result)
    }));

    return (
        <>
            <Layout>
                <Head>
                    <title>Wyniki {type ? `- ${type}` : ""}</title>
                </Head>
                <div className="border-1 border-gray-600 border-solid">
                    <div className="flex flex-wrap">
                        <ResultLink setType={setType} type={""} text="WSZYSCY" />
                        <ResultLink setType={setType} type={"open-k"} text="OPEN KOBIET" />
                        <ResultLink setType={setType} type={"open-m"} text="OPEN MĘŻCZYZN" />
                        <ResultLink setType={setType} type={"K1"} text="K1" />
                        <ResultLink setType={setType} type={"K2"} text="K2" />
                        <ResultLink setType={setType} type={"K3"} text="K3" />
                        <ResultLink setType={setType} type={"M1"} text="M1" />
                        <ResultLink setType={setType} type={"M2"} text="M2" />
                        <ResultLink setType={setType} type={"M3"} text="M3" />
                        <ResultLink setType={setType} type={"M4"} text="M4" />
                    </div>

                    <div className={`grid`} style={{ gridTemplateColumns: fullNumberColumns }}>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Miejsce</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Nr. zaw.</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Imię Nazwisko</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Miejscowość</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Klub</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Kraj</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Rok urodz.</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Kat.</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Tempo km/h</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Wynik</div>
                        <div className={tdClassName + " bg-orange-600 text-white font-semibold"}>Strata</div>

                        {result.map((p, i) => {
                            const bg = i % 2 === 0 ? "bg-gray-200" : "bg-gray-100";
                            return (
                                <Fragment key={p.id}>
                                    <div className={`${tdClassName} ${bg}`}>{i + 1}</div>
                                    <div className={`${tdClassName} ${bg}`}>{p.number}</div>
                                    <div className={`${tdClassName} ${bg} hidden sm:block`}>
                                        {getName(p.name, p.lastName)}
                                    </div>
                                    <div className={`${tdClassName} ${bg} block sm:hidden`}>
                                        {getCompactName(p.name, p.lastName)}
                                    </div>
                                    <div className={`${tdClassName} ${bg}`}>{p.city}</div>
                                    <div className={`${tdClassName} ${bg}`}>{p.team}</div>
                                    <div className={`${tdClassName} ${bg}`}>{p.country}</div>
                                    <div className={`${tdClassName} ${bg}`}>{p.birthYear}</div>
                                    <div className={`${tdClassName} ${bg}`}>{p.raceCategory}</div>

                                    <div className={`${tdClassName} ${bg}`}>
                                        {Math.round((13330 / (p.result / 1000 / 60 / 60) / 1000) * 100) / 100}
                                    </div>
                                    <div className={`${tdClassName} ${bg}`}>{p.resultStr}</div>
                                    <div className={`${tdClassName} ${bg}`}>{p.diff === 0 ? "" : "+ " + p.diffStr}</div>
                                </Fragment>
                            );
                        })}
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
