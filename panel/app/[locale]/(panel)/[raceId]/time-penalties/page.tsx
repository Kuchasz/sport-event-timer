import { authenticate } from "auth";
import { TimePenalties } from "./time-penalties";

export default async function () {
    await authenticate();
    return <TimePenalties />;
}
