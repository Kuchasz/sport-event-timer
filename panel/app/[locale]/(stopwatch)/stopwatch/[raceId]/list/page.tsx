import { authenticate } from "auth";
import { PlayersList } from "./list";

export default async function () {
    await authenticate();
    return <PlayersList />;
}
