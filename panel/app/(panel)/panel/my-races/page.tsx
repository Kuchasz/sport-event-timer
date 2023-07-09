import { authenticate } from "../../../../auth";
import { MyRaces } from "./my-races";

export default async function () {
    await authenticate();
    return <MyRaces />;
}
