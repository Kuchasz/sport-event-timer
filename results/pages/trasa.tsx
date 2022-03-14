import Head from "next/head";
import React from "react";
import { Slogan } from "../components/slogan";

const Trasa = () => {
    return (
        <>
            <Head>
                <title>Trasa</title>
            </Head>
            <div>
                <Slogan
                    title="Trasa wyścigu"
                    excerpt="Udostępniamy trasę wyścigu w formie kompatybilnej z komputerami rowerowymi"
                    photo="assets/mapka-trasa-2022.jpg"
                />
                <div className="flex w-full bg-zinc-200 justify-center">
                    <div className="max-w-6xl my-14">
                        <div className="bg-white border border-gray-300 rounded-sm p-10">
                            <h2 className="text-2xl uppercase font-semibold">trasa wyścigu</h2>
                            <br />
                            <span>
                                W roku 2022 Rura na Kocierz toczy się dwa dni z rzędu. Pierwszego dnia, podczas wyścigu
                                ze startu wspólnego do wyboru będą dostępne dwa dystanse.
                                <br />
                                <br />
                                <div className="mt-12 mb-2 flex flex-col items-start">
                                    <span className="flex items-baseline">
                                        <h3 className="font-semibold text-xl">Start wspólny - FUN</h3>
                                        <div className="ml-2">52km / 1120m przewyższenia</div>
                                    </span>
                                    <span>
                                        Start honorowy z Kozubnika, po 5km wjeżdżamy na 20-kilometrową pętlę. Pętlę
                                        przejeżdżamy w całości jeden raz, na 48km nie wracamy już w kierunku Porąbki
                                        tylko odbijamy w kierunku Kocierza
                                    </span>
                                    <div className="my-2 flex">
                                        <a
                                            href="/gpsies/rura_na_kocierz_2022_start_wspolny_fun.gpx"
                                            className="border py-2 px-4 border-gray-200"
                                        >
                                            Pobierz plik .GPX
                                        </a>
                                        <a
                                            target="_blank"
                                            href="https://www.strava.com/routes/2897229113276376702"
                                            className="ml-2 border py-2 px-4 border-gray-200 flex"
                                        >
                                            Zobacz w
                                            <img className="ml-2 self-center" src="assets/strava-logo-small.jpg" />
                                        </a>
                                    </div>
                                    <a target="_blank" href="https://www.strava.com/routes/2897229113276376702">
                                        <img src="assets/trasa-start-wspolny-fun.jpg" />
                                    </a>
                                </div>
                                <div className="mt-24 mb-2 flex flex-col items-start">
                                    <span className="flex items-baseline">
                                        <h3 className="font-semibold text-xl">Start wspólny - PRO</h3>
                                        <div className="ml-2">104km / 2340m przewyższenia</div>
                                    </span>
                                    <span>
                                        Start honorowy z Kozubnika, po 5km wjeżdżamy na 20-kilometrową pętlę. Pętlę
                                        przejeżdżamy w całości trzy razy, na 100km nie wracamy już w kierunku Porąbki
                                        tylko lecimy Rurę na Kocierz 💨💨💨
                                    </span>
                                    <div className="my-2 flex">
                                        <a
                                            href="/gpsies/rura_na_kocierz_2022_start_wspolny_pro.gpx"
                                            className="border py-2 px-4 border-gray-200"
                                        >
                                            Pobierz plik .GPX
                                        </a>
                                        <a
                                            target="_blank"
                                            href="https://www.strava.com/routes/2897239559631378416"
                                            className="ml-2 border py-2 px-4 border-gray-200 flex"
                                        >
                                            Zobacz w
                                            <img className="ml-2 self-center" src="assets/strava-logo-small.jpg" />
                                        </a>
                                    </div>
                                    <a target="_blank" href="https://www.strava.com/routes/2897239559631378416">
                                        <img src="assets/trasa-start-wspolny-pro.jpg" />
                                    </a>
                                </div>
                                <div className="mt-24 mb-2 flex flex-col items-start">
                                    <span className="flex items-baseline">
                                        <h3 className="font-semibold text-xl">Time Trial</h3>
                                        <div className="ml-2">11km / 380m przewyższenia</div>
                                    </span>
                                    <span>
                                        Wymagająca, górska trasa wyścigu indywidualnej jazdy na czas. Startujemy w parku
                                        w Gminie Łękawica, na zawodników czeka 11km i 380m wzniosu. Po drodze
                                        przejedziemy ekstra atrakcję, ul. Widokową
                                    </span>
                                    <div className="my-2 flex">
                                        <a
                                            href="/gpsies/rura_na_kocierz_2022_time_trial.gpx"
                                            className="border py-2 px-4 border-gray-200"
                                        >
                                            Pobierz plik .GPX
                                        </a>
                                        <a
                                            target="_blank"
                                            href="https://www.strava.com/routes/2897239796664260592"
                                            className="ml-2 border py-2 px-4 border-gray-200 flex"
                                        >
                                            Zobacz w
                                            <img className="ml-2 self-center" src="assets/strava-logo-small.jpg" />
                                        </a>
                                    </div>
                                    <a target="_blank" href="https://www.strava.com/routes/2897239796664260592">
                                        <img src="assets/trasa-time-trial.jpg" />
                                    </a>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Trasa;
