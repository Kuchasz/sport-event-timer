import { authenticate } from "auth";
import { TimingPoints } from "./timing-points";

export default async function () {
    await authenticate();
    return <TimingPoints/>
};