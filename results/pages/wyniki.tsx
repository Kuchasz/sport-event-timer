import Head from "next/head";
import React from "react";
import { Anchor } from "components/anchor";
import { Slogan } from "components/slogan";

const Lista = () => {
    return (
        <>
            <Head>
                <title>Lista zawodników</title>
            </Head>
            <div>
                <Slogan
                    title="Wyniki"
                    excerpt="Wyniki aktualizowane na żywo z podziałem na dystanse i kategorie"
                    photo="assets/wyniki-2022.jpg"
                />
                <div className="flex w-full bg-zinc-200 justify-center">
                    <div className="max-w-6xl my-14">
                        <div className="bg-white border border-gray-300 rounded-sm p-10">
                            <h2 className="text-2xl uppercase font-semibold">Wyniki na żywo</h2>
                            <br />
                            <span>
                                Zawodnicy startujący w klasyfikacji generalnej uwzględnieni zostali w wyścigach RnK PRO
                                i RnK Time Trial.
                                <br />
                                <br />
                                <Anchor className="my-2" href={"/wyniki/pro"}>
                                    RnK PRO
                                </Anchor>
                                <Anchor className="my-2" href={"/wyniki/fun"}>
                                    RnK FUN
                                </Anchor>
                                <Anchor className="my-2" href={"/wyniki/tt"}>
                                    RnK Time Trial
                                </Anchor>
                                <Anchor className="my-2" href={"/wyniki/gc"}>
                                    RnK Klasyfikacja Generalna
                                </Anchor>
                                <Anchor className="my-2" href={"/wyniki/gc"}>
                                    RnK Klasyfikacja Drużynowa
                                </Anchor>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Lista;
