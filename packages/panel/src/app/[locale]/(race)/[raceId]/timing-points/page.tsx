import { authenticate } from "src/auth";
import { TimingPoints } from "./timing-points";

export default async function () {
    await authenticate();

    return <TimingPoints />;
}
