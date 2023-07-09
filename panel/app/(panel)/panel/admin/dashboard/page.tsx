import { authenticate } from "auth";
import { Dashboard } from "./dashboard";

export default async function () {
    await authenticate();
    return <Dashboard/>
};