import { authenticate } from "auth";
import { TimingPoint } from "./timing-point";
import { trpcRSC } from "trpc-core-rsc";

export default async function ({ params: { timingPointId, raceId } }: { params: { raceId: string; timingPointId: string } }) {
    await authenticate();
    const timingPoint = await trpcRSC.timingPoint.timingPoint.query({ raceId: Number(raceId), timingPointId: Number(timingPointId) });
    const timingPointUrls = await trpcRSC.timingPoint.timingPointAccessUrls.query({
        raceId: Number(raceId),
        timingPointId: Number(timingPointId),
    });

    return <TimingPoint initialTimingPointUrls={timingPointUrls} initialTimingPoint={timingPoint} />;
}
