import { authenticate } from "src/auth";
import { PlayersDialPad } from "./pad";

export default async function () {
    await authenticate();
    return <PlayersDialPad />;
}
