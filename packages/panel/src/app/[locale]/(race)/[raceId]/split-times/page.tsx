import { authenticate } from "src/auth";
import { SplitTimes } from "./split-times";

export default async function () {
    await authenticate();
    return <SplitTimes />;
}
