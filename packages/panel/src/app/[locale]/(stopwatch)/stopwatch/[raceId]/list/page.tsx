import { authenticate } from "src/auth";
import { PlayersList } from "./list";

export default async function () {
    await authenticate();
    return <PlayersList />;
}
