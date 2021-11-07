import classNames from "classnames";
import Head from "next/head";
import Icon from "@mdi/react";
import Layout from "../../components/layout";
import Link from "next/link";
import React from "react";
import { Fragment, useEffect, useState } from "react";
import { getState } from "../../api";
import { Loader } from "../../components/loader";
import { mdiMenu } from "@mdi/js";
import { Player } from "@set/timer/model";
import { sort } from "../../utils";
import { TimerState } from "@set/timer/store";
import { useRouter } from "next/dist/client/router";

export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });

export const formatTime = (time?: number) => {
    if (time === undefined) return "--:--:--";

    const timeDate = new Date(0, 0, 0, 0, 0, 0, time);

    return `${formatNumber(timeDate.getHours())}:${formatNumber(timeDate.getMinutes())}:${formatNumber(
        timeDate.getSeconds()
    )}.${formatNumber(timeDate.getMilliseconds(), 3).slice(0, 1)}`;
};

const tdClassName = "flex flex-1 p-2 py-3 text-sm";
const headerClassName =
    tdClassName + " border-b-2 border-orange-500 bg-gray-100 font-semibold cursor-pointer sticky top-0";

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
    <Link href={`/wyniki/${type}`}>
        <a
            onClick={onOpen}
            className={classNames(
                "cursor-pointer border-b-2 px-2 md:mx-2 self-center my-2 md:my-0 py-2 text-center text-gray-400 text-sm font-medium",
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
    K1: "K1",
    K2: "K2",
    K3: "K3",
    M1: "M1",
    M2: "M2",
    M3: "M3",
    M4: "M4"
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
                    <ResultLink
                        onOpen={() => setCollapsed(true)}
                        selectedType={passedType}
                        type={""}
                        text={namesForTypes[""]}
                    />
                    <ResultLink
                        onOpen={() => setCollapsed(true)}
                        selectedType={passedType}
                        type={"open-k"}
                        text={namesForTypes["open-k"]}
                    />
                    <ResultLink
                        onOpen={() => setCollapsed(true)}
                        selectedType={passedType}
                        type={"open-m"}
                        text={namesForTypes["open-m"]}
                    />
                    <ResultLink
                        onOpen={() => setCollapsed(true)}
                        selectedType={passedType}
                        type={"K1"}
                        text={namesForTypes["K1"]}
                    />
                    <ResultLink
                        onOpen={() => setCollapsed(true)}
                        selectedType={passedType}
                        type={"K2"}
                        text={namesForTypes["K2"]}
                    />
                    <ResultLink
                        onOpen={() => setCollapsed(true)}
                        selectedType={passedType}
                        type={"K3"}
                        text={namesForTypes["K3"]}
                    />
                    <ResultLink
                        onOpen={() => setCollapsed(true)}
                        selectedType={passedType}
                        type={"M1"}
                        text={namesForTypes["M1"]}
                    />
                    <ResultLink
                        onOpen={() => setCollapsed(true)}
                        selectedType={passedType}
                        type={"M2"}
                        text={namesForTypes["M2"]}
                    />
                    <ResultLink
                        onOpen={() => setCollapsed(true)}
                        selectedType={passedType}
                        type={"M3"}
                        text={namesForTypes["M3"]}
                    />
                    <ResultLink
                        onOpen={() => setCollapsed(true)}
                        selectedType={passedType}
                        type={"M4"}
                        text={namesForTypes["M4"]}
                    />
                </div>
                <div onClick={() => setCollapsed(false)} className={classNames("flex p-2", { ["hidden"]: !collapsed })}>
                    <Icon size={1} path={mdiMenu}></Icon>
                    <p className="ml-2 font-medium">{namesForTypes[passedType]}</p>
                </div>
            </div>
            <div className="hidden md:flex flex-wrap px-2 py-4">
                <ResultLink
                    onOpen={() => setCollapsed(true)}
                    selectedType={passedType}
                    type={""}
                    text={namesForTypes[""]}
                />
                <ResultLink
                    onOpen={() => setCollapsed(true)}
                    selectedType={passedType}
                    type={"open-k"}
                    text={namesForTypes["open-k"]}
                />
                <ResultLink
                    onOpen={() => setCollapsed(true)}
                    selectedType={passedType}
                    type={"open-m"}
                    text={namesForTypes["open-m"]}
                />
                <ResultLink
                    onOpen={() => setCollapsed(true)}
                    selectedType={passedType}
                    type={"K1"}
                    text={namesForTypes["K1"]}
                />
                <ResultLink
                    onOpen={() => setCollapsed(true)}
                    selectedType={passedType}
                    type={"K2"}
                    text={namesForTypes["K2"]}
                />
                <ResultLink
                    onOpen={() => setCollapsed(true)}
                    selectedType={passedType}
                    type={"K3"}
                    text={namesForTypes["K3"]}
                />
                <ResultLink
                    onOpen={() => setCollapsed(true)}
                    selectedType={passedType}
                    type={"M1"}
                    text={namesForTypes["M1"]}
                />
                <ResultLink
                    onOpen={() => setCollapsed(true)}
                    selectedType={passedType}
                    type={"M2"}
                    text={namesForTypes["M2"]}
                />
                <ResultLink
                    onOpen={() => setCollapsed(true)}
                    selectedType={passedType}
                    type={"M3"}
                    text={namesForTypes["M3"]}
                />
                <ResultLink
                    onOpen={() => setCollapsed(true)}
                    selectedType={passedType}
                    type={"M4"}
                    text={namesForTypes["M4"]}
                />
            </div>
        </>
    );
};

const Index = ({}: Props) => {
    const [state, setState] = useState<TimerState>();
    const router = useRouter();

    useEffect(() => {
        getState().then(setState);
    }, []);

    if (!state)
        return (
            <div className="flex font-semibold justify-center items-center">
                Smarujemy łańcuch...
                <Loader />
            </div>
        );

    const { type } = router.query as { type: Types[] };
    const types = type || [];
    const passedType = (types[0] || "") as Types;

    const startTimeKeeper = state.timeKeepers.find((x) => x.type === "start");
    const stopTimeKeeper = state.timeKeepers.find((x) => x.type === "end");
    const fullNumberColumns =
        "auto auto minmax(auto, 1fr) minmax(auto, 1fr) minmax(auto, 1fr) auto auto auto auto auto auto";

    const playersWithTimes = state.players
        .filter(filterByType(passedType))
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
            <Head>
                <title>Wyniki {passedType ? `- ${passedType}` : ""}</title>
            </Head>
            <div className="flex flex-col text-gray-600">
                <ResultLinks passedType={passedType} />

                <div
                    className="grid flex-grow auto-rows-min bg-gray-100"
                    style={{ gridTemplateColumns: fullNumberColumns }}
                >
                    <div className={headerClassName}>Miejsce</div>
                    <div className={headerClassName}>Nr. zaw.</div>
                    <div className={headerClassName}>Imię Nazwisko</div>
                    <div className={headerClassName}>Miejscowość</div>
                    <div className={headerClassName}>Klub</div>
                    <div className={headerClassName}>Kraj</div>
                    <div className={headerClassName}>Rok urodz.</div>
                    <div className={headerClassName}>Kat.</div>
                    <div className={headerClassName}>VŚr km/h</div>
                    <div className={headerClassName}>Wynik</div>
                    <div className={headerClassName}>Strata</div>

                    {result.map((p, i) => {
                        const bg = i % 2 === 0 ? "bg-gray-200" : "bg-gray-100";
                        return (
                            <Fragment key={p.id}>
                                <div className={`${tdClassName} ${bg}`}>{i + 1}</div>
                                <div className={`${tdClassName} ${bg}`}>{p.number}</div>
                                <div className={`${tdClassName} ${bg} hidden font-semibold sm:block`}>
                                    {getName(p.name, p.lastName)}
                                </div>
                                <div className={`${tdClassName} ${bg} block font-semibold sm:hidden`}>
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
                                <div className={`${tdClassName} ${bg} font-semibold`}>{p.resultStr}</div>
                                <div className={`${tdClassName} ${bg}`}>{p.diff === 0 ? "" : "+ " + p.diffStr}</div>
                            </Fragment>
                        );
                    })}
                </div>
            </div>
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
