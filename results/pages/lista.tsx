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
                    title="Lista zawodników"
                    excerpt="Lista zawodników z podziałem na dystanse"
                    photo="assets/lista-startowa-2022.jpg"
                />
                <div className="flex w-full bg-zinc-200 justify-center">
                    <div className="max-w-6xl my-14">
                        <div className="bg-white border border-gray-300 rounded-sm p-10">
                            <h2 className="text-2xl uppercase font-semibold">lista zawodników</h2>
                            <br />
                            <span>
                                Zawodnicy startujący w klasyfikacji generalnej uwzględnieni zostali w wyścigach RnK PRO
                                i RnK Time Trial. Godziny startów w TT zawodników klasyfikacji generalnej zostaną
                                uzupełnione po zakończeniu RnK PRO.
                                <br />
                                <br />
                                <Anchor href={"/lista/pro"}>RnK PRO</Anchor>
                                <Anchor className="my-4" href={"/lista/fun"}>
                                    RnK FUN
                                </Anchor>
                                <Anchor href={"/lista/tt"}>RnK Time Trial</Anchor>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Lista;
