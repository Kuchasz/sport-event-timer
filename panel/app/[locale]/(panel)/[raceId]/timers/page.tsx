import { authenticate } from "auth";
import { Timers } from "./timers";

export default async function () {
    await authenticate();
    return <Timers />;
}
