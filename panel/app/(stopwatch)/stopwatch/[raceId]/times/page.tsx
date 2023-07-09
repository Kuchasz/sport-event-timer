import { authenticate } from "auth";
import { PlayersTimes } from "./players-times";

export default async function () {
    await authenticate();
    return <PlayersTimes/>
};