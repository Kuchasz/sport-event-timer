import { authenticate } from "src/auth";
import { PlayerReassignTime } from "./player-reassign-time";

export default async function () {
    await authenticate();
    return <PlayerReassignTime />;
}
