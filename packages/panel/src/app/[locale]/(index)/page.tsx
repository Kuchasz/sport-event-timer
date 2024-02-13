import { authenticate } from "src/auth";
import { Races } from "./races";
import { trpcRSC } from "src/trpc-core-rsc";

export default async function () {
    await authenticate();
    const races = await trpcRSC.race.races.query();

    return <Races initialData={races} />;
}
