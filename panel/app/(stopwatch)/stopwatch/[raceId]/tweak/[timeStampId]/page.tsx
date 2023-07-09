import { authenticate } from "auth";
import { TweakTimeStamp } from "./tweak-time-stamp";

export default async function () {
    await authenticate();
    return <TweakTimeStamp />;
}
