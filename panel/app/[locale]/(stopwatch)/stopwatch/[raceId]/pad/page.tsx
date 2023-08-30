import { authenticate } from "auth";
import { PlayersDialPad } from "./pad";

export default async function () {
    await authenticate();
    return <PlayersDialPad />;
}
