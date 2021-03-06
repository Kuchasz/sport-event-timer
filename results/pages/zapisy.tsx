import Head from "next/head";
import React from "react";

const Zapisy = () => {
    return (
        <>
            <Head>
                <title>Zapisy</title>
            </Head>
            <div className="flex h-full p-16 flex-1 items-center justify-center">
                <a
                    className="bg-zinc-200 hover:bg-zinc-300"
                    target="_blank"
                    href="https://dostartu.pl/rura-na-kocierz-v6591"
                >
                    <h2 className="text-3xl p-12">Kliknij aby przejść do zapisów</h2>
                </a>
            </div>
        </>
    );
};

export default Zapisy;
