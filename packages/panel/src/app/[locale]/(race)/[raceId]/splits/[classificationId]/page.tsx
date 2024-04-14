import { authenticate } from "src/auth";
import { SplitsList } from "./splits-list";
import { trpcRSC } from "src/trpc-core-rsc";

export default async function ({ params: { classificationId, raceId } }: { params: { raceId: string; classificationId?: string } }) {
    await authenticate();

    const timingPoints = await trpcRSC.timingPoint.timingPoints.query({ raceId: Number(raceId) });
    const splits = await trpcRSC.split.splits.query({ raceId: Number(raceId), classificationId: Number(classificationId) });
    const splitsOrder = await trpcRSC.split.splitsOrder.query({ raceId: Number(raceId), classificationId: Number(classificationId) });

    return (
        <SplitsList
            raceId={Number(raceId)}
            classificationId={Number(classificationId)}
            splitsOrder={splitsOrder}
            splits={splits}
            timingPoints={timingPoints}
        />
    );
}
