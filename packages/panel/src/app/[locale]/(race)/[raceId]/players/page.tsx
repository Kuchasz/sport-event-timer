import { authenticate } from "src/auth";
import { Players } from "./players";

export default async function () {
    await authenticate();
    return <Players />;
}
