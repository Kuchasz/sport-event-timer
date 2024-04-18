import { authenticate } from "src/auth";
import { SplitsList } from "./splits-list";
import { trpcRSC } from "src/trpc-core-rsc";
import { SidePage } from "src/components/pages";
import { Classifications } from "../classifications";

export default async function ({ params: { classificationId, raceId } }: { params: { raceId: string; classificationId?: string } }) {
    await authenticate();

    const timingPoints = await trpcRSC.timingPoint.timingPoints.query({ raceId: Number(raceId) });
    const splits = await trpcRSC.split.splits.query({ raceId: Number(raceId), classificationId: Number(classificationId) });
    const splitsOrder = await trpcRSC.split.splitsOrder.query({ raceId: Number(raceId), classificationId: Number(classificationId) });
    const classifications = await trpcRSC.classification.classifications.query({ raceId: Number(raceId) });
    const classification = await trpcRSC.classification.classification.query({
        raceId: Number(raceId),
        classificationId: Number(classificationId),
    });

    return (
        <SidePage
            side={<Classifications raceId={raceId} classificationId={classificationId} classifications={classifications} />}
            content={
                <SplitsList
                    raceId={Number(raceId)}
                    classificationId={Number(classificationId)}
                    classificationName={classification.name}
                    splitsOrder={splitsOrder}
                    splits={splits}
                    timingPoints={timingPoints}
                />
            }></SidePage>
    );
}
