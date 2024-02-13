import { authenticate } from "src/auth";
import { Dashboard } from "./dashboard";

export default async function () {
    await authenticate();
    return <Dashboard />;
}
