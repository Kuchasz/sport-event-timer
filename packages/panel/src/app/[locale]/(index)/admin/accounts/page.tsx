import { authenticate } from "src/auth";
import { Accounts } from "./accounts";

export default async function () {
    await authenticate();
    return <Accounts />;
}
