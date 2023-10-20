import { authenticate } from "auth";
import { Races } from "./races";
import { trpcRSC } from "trpc-core-rsc";

export default async function () {
    const races = await trpcRSC.race.races.query();

    await authenticate();
    return <Races initialData={races}/>;
}
