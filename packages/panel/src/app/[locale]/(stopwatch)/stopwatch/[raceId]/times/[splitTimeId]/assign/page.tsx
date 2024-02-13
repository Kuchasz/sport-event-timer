import { authenticate } from "src/auth";
import { PlayerAssignTime } from "./player-assign-time";

export default async function () {
    await authenticate();
    return <PlayerAssignTime />;
}
