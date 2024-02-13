import { RaceCountdown } from "./countdown";
import { trpcRSC } from "src/trpc-core-rsc";

export default async function ({ params }: { params: { raceId: string } }) {
    const { raceId } = params;

    const players = await trpcRSC.player.startList.query({ raceId: Number(raceId) });

    return <RaceCountdown raceId={parseInt(raceId)} initialPlayers={players} renderTime={new Date().getTime()} />;
}
