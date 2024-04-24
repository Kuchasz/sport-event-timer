import { authenticate } from "src/auth";
import { Settings } from "./settings";
import { StandardPage } from "src/components/pages";

export default async function () {
    await authenticate();
    return (
        <StandardPage>
            <Settings />
        </StandardPage>
    );
}
