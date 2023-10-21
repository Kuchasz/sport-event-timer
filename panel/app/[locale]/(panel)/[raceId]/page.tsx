import { authenticate } from "auth";
import { Race } from "./race";

export default async function () {
    await authenticate();
    return <Race />;
}
