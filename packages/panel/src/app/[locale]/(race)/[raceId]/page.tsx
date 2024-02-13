import { authenticate } from "src/auth";
import { BasicInfo } from "./basic-info";

export default async function () {
    await authenticate();
    return <BasicInfo />;
}
