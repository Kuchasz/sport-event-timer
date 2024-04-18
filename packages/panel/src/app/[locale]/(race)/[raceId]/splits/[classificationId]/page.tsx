import { authenticate } from "src/auth";
import { trpcRSC } from "src/trpc-core-rsc";
import { ClassificationSplits } from "./classification-splits";

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
        <ClassificationSplits
            raceId={Number(raceId)}
            classification={classification}
            initialSplitsOrder={splitsOrder}
            initialSplits={splits}
            initialClassifications={classifications}
            timingPoints={timingPoints}
        />
    );
}
