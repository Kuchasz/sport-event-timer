import Head from "next/head";
import { authenticate } from "../../../auth";
import { Dashboard } from "./dashboard";

export default async function () {
    await authenticate();
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <div className="border-1 flex flex-wrap h-full border-gray-600 border-solid">
                <Dashboard />
            </div>
        </>
    );
}
