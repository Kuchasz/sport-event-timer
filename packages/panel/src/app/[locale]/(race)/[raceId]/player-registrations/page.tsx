import { authenticate } from "src/auth";
import { PlayerRegistrations } from "./player-registrations";

export default async function () {
    await authenticate();
    return <PlayerRegistrations />;
}
