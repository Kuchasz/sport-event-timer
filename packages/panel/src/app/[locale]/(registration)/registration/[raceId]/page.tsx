import { trpcRSC } from "src/trpc-core-rsc";
import { Registration } from "./registration";
import { Task } from "@set/utils/dist/task";
import { notFound } from "next/navigation";

export default async function ({ params: { raceId } }: { params: { raceId: string } }) {
    const registrationSystemStatus = await Task.tryCatch(
        trpcRSC.playerRegistration.registrationStatus.query({
            raceId: Number(raceId),
        }),
    );

    if (registrationSystemStatus.type !== "success") notFound();

    const teams = await trpcRSC.playerRegistration.teams.query({ raceId: Number(raceId) });

    return (
        <Registration raceId={parseInt(raceId)} initialRegistrationSystemStatus={registrationSystemStatus.result} initialTeams={teams} />
    );
}
