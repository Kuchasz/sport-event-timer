import { authenticate } from "src/auth";
import { trpcRSC } from "src/trpc-core-rsc";
import { ClassificationResults } from "./classification-results";

export default async function ({ params: { classificationId, raceId } }: { params: { raceId: string; classificationId?: string } }) {
    await authenticate();

    const classifications = await trpcRSC.classification.classifications.query({ raceId: Number(raceId) });

    const classification = await trpcRSC.classification.classification.query({
        raceId: Number(raceId),
        classificationId: Number(classificationId),
    });

    return <ClassificationResults raceId={Number(raceId)} classification={classification} initialClassifications={classifications} />;
}
