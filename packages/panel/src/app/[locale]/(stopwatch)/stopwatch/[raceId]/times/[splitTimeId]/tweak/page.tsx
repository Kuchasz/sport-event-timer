import { authenticate } from "src/auth";
import { TweakTimeStamp } from "./tweak-time-stamp";

export default async function () {
    await authenticate();
    return <TweakTimeStamp />;
}
