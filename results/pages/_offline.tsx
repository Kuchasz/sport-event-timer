import Head from "next/head";
import React from "react";

const Offline = () => {
    return (
        <>
            <Head>
                <title>Offline</title>
            </Head>
            <div className="flex h-full p-16 flex-1 items-center justify-center">Sorry, we are offline :((</div>
        </>
    );
};

export default Offline;
