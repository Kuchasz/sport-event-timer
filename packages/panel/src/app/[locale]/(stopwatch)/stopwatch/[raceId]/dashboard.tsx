"use client";

import { useAtom } from "jotai";
import Head from "next/head";
import { useParams } from "next/navigation";
import { timingPointIdAtom } from "src/states/stopwatch-states";

export const Dashboard = () => {
    const { timingPointId } = useParams<{ timingPointId?: string }>()!;

    const [_, chooseTimingPoint] = useAtom(timingPointIdAtom);

    if (timingPointId) chooseTimingPoint(parseInt(timingPointId));

    return (
        <>
            <Head>
                <title>Stopwatch</title>
            </Head>
            <div className="flex w-full justify-center">
                <div className="flex w-full flex-col px-12 py-4 sm:flex-row"></div>
            </div>
            <div className="relative flex w-full justify-center overflow-hidden">
                <div className="my-12 flex w-full max-w-6xl flex-col items-start justify-center"></div>
            </div>
        </>
    );
};
