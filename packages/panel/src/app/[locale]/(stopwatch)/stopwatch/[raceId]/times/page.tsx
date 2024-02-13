import { authenticate } from "src/auth";
import { PlayersTimes } from "./players-times";

export default async function () {
    await authenticate();
    return <PlayersTimes />;
}
