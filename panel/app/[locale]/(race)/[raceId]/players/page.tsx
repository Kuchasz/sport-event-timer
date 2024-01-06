import { authenticate } from "auth";
import { Players } from "./players";

export default async function () {
    await authenticate();
    return <Players />;
}
