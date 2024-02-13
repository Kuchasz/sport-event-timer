import { RaceClock } from "./clock";

export default function () {
    return <RaceClock renderTime={new Date().getTime()} />;
}
