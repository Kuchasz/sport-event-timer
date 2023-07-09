import { authenticate } from "auth";
import { PlayerAssignTime } from "./player-assign-time";

export default async function () {
    await authenticate();
    return <PlayerAssignTime/>
};