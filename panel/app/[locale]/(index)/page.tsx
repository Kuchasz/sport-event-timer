import { authenticate } from "auth";
import { Races } from "./races";
import { trpcRSC } from "trpc-core-rsc";

export default async function () {
    await authenticate();
    const races = await trpcRSC.race.races.query();

    return <Races initialData={races} />;
}