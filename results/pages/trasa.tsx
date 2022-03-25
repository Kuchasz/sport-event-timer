import Head from "next/head";
import React from "react";
import { Anchor } from "components/anchor";
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
                                        <Anchor href="/gpsies/rura_na_kocierz_2022_start_wspolny_fun.gpx">
                                            Pobierz plik .GPX
                                        </Anchor>
                                        <Anchor href="https://www.strava.com/routes/2897229113276376702">
                                            Zobacz w
                                            <img className="ml-2 self-center" src="assets/strava-logo-small.jpg" />
                                        </Anchor>
                                    </div>
                                    <a
                                        className="w-full"
                                        target="_blank"
                                        href="https://www.strava.com/routes/2897229113276376702"
                                    >
                                        <img className="w-full" src="assets/trasa-start-wspolny-fun.jpg" />
                                    </a>
                                    <img src="assets/wysokosciowka-start-wspolny-fun.png" />
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
                                        <Anchor href="/gpsies/rura_na_kocierz_2022_start_wspolny_pro.gpx">
                                            Pobierz plik .GPX
                                        </Anchor>
                                        <Anchor href="https://www.strava.com/routes/2897239559631378416">
                                            Zobacz w
                                            <img className="ml-2 self-center" src="assets/strava-logo-small.jpg" />
                                        </Anchor>
                                    </div>
                                    <a
                                        className="w-full"
                                        target="_blank"
                                        href="https://www.strava.com/routes/2897239559631378416"
                                    >
                                        <img className="w-full" src="assets/trasa-start-wspolny-pro.jpg" />
                                    </a>
                                    <img src="assets/wysokosciowka-start-wspolny-pro.png" />
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
                                        <Anchor href="/gpsies/rura_na_kocierz_2022_time_trial.gpx">
                                            Pobierz plik .GPX
                                        </Anchor>
                                        <Anchor href="https://www.strava.com/routes/2897239796664260592">
                                            Zobacz w
                                            <img className="ml-2 self-center" src="assets/strava-logo-small.jpg" />
                                        </Anchor>
                                    </div>
                                    <a
                                        className="w-full"
                                        target="_blank"
                                        href="https://www.strava.com/routes/2897239796664260592"
                                    >
                                        <img className="w-full" src="assets/trasa-time-trial.jpg" />
                                    </a>
                                    <img src="assets/wysokosciowka-time-trial.png" />
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
