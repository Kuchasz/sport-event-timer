import { authenticate } from "src/auth";
import { BasicInfo } from "./basic-info";
import { StandardPage } from "src/components/pages";

export default async function () {
    await authenticate();
    return (
        <StandardPage>
            <BasicInfo />
        </StandardPage>
    );
}
