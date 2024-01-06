import { authenticate } from "auth";
import { PlayerRegistrations } from "./player-registrations";

export default async function () {
    await authenticate();
    return <PlayerRegistrations />;
}
