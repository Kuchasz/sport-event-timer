import { RacePreciseClock } from "./precise-lock";

export default function () {
    return <RacePreciseClock renderTime={new Date().getTime()} />;
}
