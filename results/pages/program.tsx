import Head from "next/head";
import React from "react";
import { Slogan } from "../components/slogan";

const Program = () => {
    return (
        <>
            <Head>
                <title>Program zawodów</title>
            </Head>
            <div>
                <Slogan
                    title="Program Rury na Kocierz"
                    excerpt="Program zawodów Rura na Kocierz 2022"
                    photo="assets/plan-zawodow-2022.jpg"
                />
                <div className="flex w-full bg-zinc-200 justify-center">
                    <div className="max-w-6xl my-14">
                        <div className="bg-white border border-gray-300 rounded-sm p-10">
                            <h2 className="text-2xl uppercase font-semibold">Program zawodów </h2>
                            <div className="mt-12 mb-2 flex flex-col items-start">
                                <span className="flex items-baseline">
                                    <h3 className="py-2 font-semibold text-xl">8.04.2022, piątek</h3>
                                </span>
                                <span>18:00-21:00 – otwarcie Biura Zawodów, odbieranie pakietów startowych, Kozubnik ul. Kochana 1</span>
                            </div>
                            <div className="mt-12 mb-2 flex flex-col items-start">
                                <span className="flex items-baseline">
                                    <h3 className="py-2 font-semibold text-xl">9.04.2022, sobota</h3>
                                </span>
                                <span className="py-1">7:00-9:30 – odbieranie pakietów startowych</span>
                                <span className="py-1">9:30-10:00 – odprawa techniczna</span>
                                <span className="py-1">10:15 – start zawodów dla dzieci</span>
                                <span className="py-1">10:45 – zakończenie zawodów dla dzieci</span>
                                <span className="py-1">11:00 – start RnK RACE</span>
                                <span className="py-1">16:00 – dekoracja RnK RACE</span>
                            </div>
                            <div className="mt-12 mb-2 flex flex-col items-start">
                                <span className="flex items-baseline">
                                    <h3 className="py-2 font-semibold text-xl">10.04.2022, niedziela</h3>
                                </span>
                                <span className="py-1">7:00 - 9:30 – odbieranie pakietów startowych, Park w Łękawicy ul. Parkowa </span>
                                <span className="py-1">9:30 - 10:00 – odprawa techniczna</span>
                                <span className="py-1">11:00 – start RnK ITT</span>
                                <span className="py-1">14:00 – start zawodów dla dzieci</span>
                                <span className="py-1">14:45 – dekoracja zawodów dla dzieci</span>
                                <span className="py-1">15:00 – dekoracja RnK ITT</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Program;
