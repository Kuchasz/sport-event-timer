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
                                <Anchor className="my-2" href={"/wyniki/gc/K18-99"}>
                                    RnK Klasyfikacja Generalna
                                </Anchor>
                                <Anchor className="my-2 flex" href={"/wyniki/pro/K18-29"}>
                                    RnK PRO <span className="pl-4 self-end text-sm"> Klasyfikacja wiekowa</span>
                                </Anchor>
                                <Anchor className="my-2 flex" href={"/wyniki/fun/K18-29"}>
                                    RnK FUN <span className="pl-4 self-end text-sm"> Klasyfikacja wiekowa</span>
                                </Anchor>
                                <Anchor className="my-2 flex" href={"/wyniki/tt/K18-29"}>
                                    RnK Time Trial <span className="pl-4 self-end text-sm"> Klasyfikacja wiekowa</span>
                                </Anchor>
                                <Anchor className="my-2" href={"/wyniki/team"}>
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
