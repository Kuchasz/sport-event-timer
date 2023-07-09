import { authenticate } from "auth";
import { SplitTimes } from "./split-times";

export default async function () {
    await authenticate();
    return <SplitTimes/>
};