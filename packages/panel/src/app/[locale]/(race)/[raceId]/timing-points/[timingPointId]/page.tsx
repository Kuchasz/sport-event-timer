import { authenticate } from "src/auth";
import { TimingPoint } from "./timing-point";
import { trpcRSC } from "src/trpc-core-rsc";
import { StandardPage } from "src/components/pages";

export default async function ({ params: { timingPointId, raceId } }: { params: { raceId: string; timingPointId: string } }) {
    await authenticate();
    const timingPoint = await trpcRSC.timingPoint.timingPoint.query({ raceId: Number(raceId), timingPointId: Number(timingPointId) });
    const timingPointUrls = await trpcRSC.timingPoint.timingPointAccessUrls.query({
        raceId: Number(raceId),
        timingPointId: Number(timingPointId),
    });

    return (
        <StandardPage>
            <TimingPoint initialTimingPointUrls={timingPointUrls} initialTimingPoint={timingPoint} />
        </StandardPage>
    );
}
